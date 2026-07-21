import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function readMethodCss() {
  return readFile(new URL('../src/styles/method-editorial.css', import.meta.url), 'utf8');
}

async function readGlobalCss() {
  return readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
}

test('方法长文使用阅读栏、目录栏和方法路径，而不是卡片墙', async () => {
  const css = await readMethodCss();

  assert.match(css, /\.method-article__layout\s*\{/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*180px\)\s+minmax\(0,\s*720px\)/);
  assert.match(css, /\.method-article__toc\s*\{[^}]*display:\s*block[^}]*position:\s*sticky/s);
  assert.match(css, /\.method-article__content\s*\{[^}]*max-width:\s*720px/s);
  assert.match(css, /\.method-map ol\s*\{/);
  assert.match(css, /\.method-assessment\s*\{/);
  assert.match(css, /\.method-boundaries\s*\{/);
});

test('方法长文在平板和移动端转为单栏并保留可点击目录', async () => {
  const css = await readMethodCss();

  assert.match(
    css,
    /@media \(max-width: 1024px\)[\s\S]*?\.method-article__layout\s*\{[^}]*grid-template-columns:\s*1fr/s,
  );
  assert.match(
    css,
    /@media \(max-width: 1024px\)[\s\S]*?\.method-article__toc\s*\{[^}]*position:\s*static/s,
  );
  assert.match(
    css,
    /@media \(max-width: 1024px\)[\s\S]*?\.method-article__toc a\s*\{[^}]*min-height:\s*44px/s,
  );
  assert.match(css, /\.method-article__header h1\s*\{[^}]*overflow-wrap:\s*anywhere/s);
});

test('全局导航规则只作用于站点导航，不泄漏到正文 nav', async () => {
  const css = await readGlobalCss();

  assert.doesNotMatch(css, /^\s*nav\s*\{/m);
  assert.doesNotMatch(css, /^\s*nav\s+a(?:\s|,|\{)/m);
  assert.match(css, /\.desktop-nav\s*\{[^}]*display:\s*flex/s);
});

test('方法关系和定义列表保持编辑式层级', async () => {
  const css = await readMethodCss();
  assert.match(css, /\.method-relationship\s*\{/);
  assert.match(css, /\.method-relationship__paths\s*\{/);
  assert.match(css, /\.method-relationship__notes\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:/s);
  assert.match(css, /\.method-definitions\s*\{/);
  assert.match(css, /\.method-definitions > div\s*\{/);
  assert.match(css, /@media \(max-width: 850px\)[\s\S]*?\.method-relationship__paths,\s*\.method-relationship__notes\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.method-definitions > div\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
