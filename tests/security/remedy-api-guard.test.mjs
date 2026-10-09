import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync(
  new URL('../../src/app/api/remedy/route.ts', import.meta.url),
  'utf8'
);

test('remedy POST always returns an explicit no-store mutation denial', () => {
  assert.match(route, /export async function POST\(\)/);
  assert.match(route, /error:\s*'MUTATION_DISABLED'/);
  assert.match(route, /status:\s*403/);
  assert.match(route, /'Cache-Control':\s*'no-store'/);
});

test('remedy POST does not parse arbitrary requests or invoke an executor', () => {
  assert.doesNotMatch(route, /from\s+['"]@\/lib\/autonom['"]/);
  assert.doesNotMatch(route, /\bexecuteAction\s*\(/);
  assert.doesNotMatch(route, /\brequest\.json\s*\(/);
  assert.doesNotMatch(route, /\bfetch\s*\(/);
  assert.doesNotMatch(route, /\bawait\b/);
});
