import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function workflow(name) {
  return readFileSync(new URL(`../../.github/workflows/${name}`, import.meta.url), 'utf8');
}

function assertNoLiveOrWriteCapabilities(content) {
  assert.doesNotMatch(content, /^\s+(?:contents|pull-requests|issues|actions):\s*write\s*$/m);
  assert.doesNotMatch(content, /\bsecrets\.[A-Za-z_][A-Za-z0-9_]*/);
  assert.doesNotMatch(content, /\bruns-on:\s*\[?self-hosted\b/);
  assert.doesNotMatch(content, /\bactions\/checkout@/);
  assert.doesNotMatch(content, /^\s*git\s+push\b/m);
  assert.doesNotMatch(content, /^\s*curl\s+/m);
  assert.match(content, /^\s*exit\s+1\s*$/m);
  assert.match(content, /^\s*contents:\s*read\s*$/m);
}

test('legacy self-heal dispatch remains quarantine-only', () => {
  const content = workflow('self-heal.yml');
  assert.match(content, /^\s*repository_dispatch:\s*$/m);
  assert.match(content, /^\s*types:\s*\[trigger-self-heal\]\s*$/m);
  assert.doesNotMatch(content, /^\s*ref:\s*\$\{\{\s*github\.event\.client_payload/m);
  assertNoLiveOrWriteCapabilities(content);
});

test('legacy deploy cannot be triggered by a push or access runtime secrets', () => {
  const content = workflow('coolify-deploy.yml');
  assert.match(content, /^\s*workflow_dispatch:\s*$/m);
  assert.doesNotMatch(content, /^\s*(?:push|release|repository_dispatch):\s*$/m);
  assertNoLiveOrWriteCapabilities(content);
});
