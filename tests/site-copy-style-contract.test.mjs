import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('全站可见文案通过中文写作护栏', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-copy.mjs'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
});
