import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflows = [
  {
    path: '.github/workflows/self-heal.yml',
    name: 'legacy self-heal',
    trigger: /^\s{2}repository_dispatch:\s*$/m,
    expectedReason: 'SELF_HEAL_MUTATION_DISABLED',
  },
  {
    path: '.github/workflows/coolify-deploy.yml',
    name: 'legacy Coolify deploy',
    trigger: /^\s{2}workflow_dispatch:\s*$/m,
    expectedReason: 'PRODUCTION_DEPLOY_APPROVAL_REQUIRED',
  },
];

for (const entry of workflows) {
  test(`${entry.name} has no mutating event, permissions or payload execution`, () => {
    const workflow = readFileSync(entry.path, 'utf8');
    assert.match(workflow, entry.trigger);
    assert.match(workflow, /permissions:\s*\n\s*contents:\s*read/);
    assert.match(workflow, new RegExp(entry.expectedReason));
    assert.doesNotMatch(workflow, /^\s{2}(?:push|release|workflow_run):\s*$/m);
    assert.doesNotMatch(workflow, /^\s*contents:\s*write\s*$/m);
    assert.doesNotMatch(workflow, /^\s*pull-requests:\s*write\s*$/m);
    assert.doesNotMatch(workflow, /actions\/checkout|secrets\.|COOLIFY_|GITHUB_TOKEN|GH_PAT/i);
    assert.doesNotMatch(
      workflow,
      /(^|\s)(?:git\s+push|curl\s|gh\s+api|gh\s+pr|docker\s|ssh\s|pnpm\s+audit\s+fix)\b/m
    );
  });

  test(`${entry.name} exits with denial without calling an executor`, () => {
    const workflow = readFileSync(entry.path, 'utf8');
    const match = workflow.match(/^\s{8}run: \|\n((?:^\s{10}.*\n?)+)/m);
    assert.ok(match, 'Expected unconditional script denial block');
    const script = match[1]
      .split('\n')
      .map((line) => line.replace(/^\s{10}/, ''))
      .join('\n')
      .trim();
    const commands = script
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    assert.equal(commands.length, 2, 'Only an error message and explicit failure permitted');
    assert.match(commands[0], /^echo "::error title=/);
    assert.equal(commands[1], 'exit 1');
    const out = spawnSync('bash', ['-c', script], {
      encoding: 'utf8',
      timeout: 1000,
      env: { PATH: '/usr/bin:/bin' },
    });
    assert.equal(out.status, 1);
    assert.match(out.stdout, new RegExp(entry.expectedReason));
  });
}
