import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const disabled = 'MUTATION_DISABLED';

// Execute real TS handler/library exports with strict dependency stubs.
// Never contact Next, GitHub, Coolify, the worker or provider services.
function loadExport(path, allowedDependencies = {}) {
  const source = readFileSync(resolve(root, path), 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: path,
    reportDiagnostics: true,
  });
  assert.deepEqual(
    transpiled.diagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error),
    [],
    `TypeScript transpilation failed for ${path}`
  );

  const module = { exports: {} };
  const requireSafe = (name) => {
    assert.ok(Object.hasOwn(allowedDependencies, name), `${path} unexpectedly imported ${name}`);
    return allowedDependencies[name];
  };
  const script = runInNewContext(
    `(function (require, module, exports) {\n${transpiled.outputText}\n})`,
    { console, process: { env: {} } },
    { timeout: 1000 }
  );
  script(requireSafe, module, module.exports);
  return module.exports;
}

const responseStub = {
  NextResponse: {
    json(body, options) {
      return { body, status: options?.status, headers: options?.headers };
    },
  },
};

for (const path of ['src/app/api/remedy/route.ts', 'src/app/api/dispatch/route.ts']) {
  test(`${path} denies arbitrary requests without reading body`, async () => {
    const { POST } = loadExport(path, { 'next/server': responseStub });
    assert.equal(typeof POST, 'function');
    for (const payload of [
      { type: 'REDEPLOY', mode: 'ACTIVE', target: 'production' },
      { owner: 'other', repo: 'other', workflowId: 'admin', ref: 'main' },
      { type: 'ROTATE', target: 'all-secrets' },
      {},
    ]) {
      let bodyReads = 0;
      const response = await POST({
        async json() {
          bodyReads += 1;
          return payload;
        },
      });
      assert.equal(bodyReads, 0, 'No attacker-controlled body may be evaluated');
      assert.equal(response.status, 403);
      assert.equal(response.body.success, false);
      assert.equal(response.body.error, disabled);
      assert.equal(response.headers['Cache-Control'], 'no-store');
    }
  });
}

test('execution bridge rejects all action classes without invoking adapters', async () => {
  let coolifyReads = 0;
  const { executeAction } = loadExport('src/lib/autonom.ts', {
    './coolify': {
      async getCoolifyApplications() {
        coolifyReads += 1;
        throw Error('unexpected Coolify invocation');
      },
    },
  });
  for (const type of ['REDEPLOY', 'PATCH', 'SYNC', 'ROTATE', 'SCALE', 'REBOOT', 'ROLLBACK']) {
    const result = await executeAction({
      id: 'remedy-arbitrary',
      type,
      mode: 'ACTIVE',
      severity: 'CRITICAL',
      target: 'production',
    });
    assert.equal(result.success, false);
    assert.equal(result.error, disabled);
  }
  assert.equal(coolifyReads, 0);
});

test('GitHub library denies arbitrary dispatch coordinates', async () => {
  let dispatches = 0;
  class FakeOctokit {
    rest = {
      repos: {
        async createDispatchEvent() {
          dispatches += 1;
          throw Error('unexpected GitHub dispatch');
        },
      },
    };
  }
  const { dispatchWorkflow } = loadExport('src/lib/github.ts', {
    octokit: { Octokit: FakeOctokit },
  });
  const response = await dispatchWorkflow('attacker', 'other-repo', 'dangerous-mutation', 'main', {
    source: 'telegram',
    approved: true,
  });
  assert.equal(response.success, false);
  assert.equal(response.error, disabled);
  assert.equal(dispatches, 0);
});

test('mutation routes cannot regain direct mutator imports or network calls', () => {
  for (const path of ['src/app/api/remedy/route.ts', 'src/app/api/dispatch/route.ts']) {
    const source = readFileSync(resolve(root, path), 'utf8');
    assert.doesNotMatch(
      source,
      /\b(?:executeAction|dispatchWorkflow|deployApplication|createDispatchEvent|fetch)\s*\(/,
      `${path} must remain deny-only`
    );
    assert.doesNotMatch(source, /\brequest\.json\s*\(/);
  }
});
