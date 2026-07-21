import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('方法长标题按方法名和要点分成两层', async () => {
  const component = await readFile(
    new URL('../src/components/MethodArticle.astro', import.meta.url),
    'utf8',
  );
  const css = await readFile(
    new URL('../src/styles/method-editorial.css', import.meta.url),
    'utf8',
  );

  assert.match(component, /article\.title\.split\('｜'/);
  assert.match(component, /method-title__name/);
  assert.match(component, /method-title__detail/);
  assert.match(css, /\.method-title__name\s*\{[^}]*display:\s*block/s);
  assert.match(css, /\.method-title__detail\s*\{[^}]*display:\s*block/s);
});
