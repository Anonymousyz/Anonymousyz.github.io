import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('中文方法要点只在分隔点换行', async () => {
  const component = await readFile(
    new URL('../src/components/MethodArticle.astro', import.meta.url),
    'utf8',
  );
  const css = await readFile(
    new URL('../src/styles/method-editorial.css', import.meta.url),
    'utf8',
  );

  assert.match(component, /methodTitleDetail\?\.split\(' · '\)/);
  assert.match(component, /method-title__term/);
  assert.match(css, /\.method-title__term\s*\{[^}]*white-space:\s*nowrap/s);
});
