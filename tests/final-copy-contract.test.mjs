import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { methodArticles } from '../src/data/methods.mjs';

test('关于页从集中数据呈现两条主线和研究与证据', async () => {
  const about = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');

  assert.match(about, /import \{ methodBySlug \} from '\.\.\/data\/methods\.mjs';/);
  assert.match(about, /import \{ positioning \} from '\.\.\/data\/portfolio\.mjs';/);
  assert.match(about, /<h1>\{positioning\[0\]\}，<br \/>\{positioning\[1\]\}<\/h1>/);
  assert.match(about, /\{methodBySlug\['research-and-judgment'\]\.title\}/);
  assert.doesNotMatch(about, /产业研究、<br \/>产品与软件|>研究与判断 <span/);
});

test('方法文章不再共用统一六节模板或密集重复第一人称', () => {
  const sectionCounts = methodArticles.map((article) => article.sections.length);
  const firstPersonCount = (JSON.stringify(methodArticles).match(/我/g) ?? []).length;

  assert.ok(new Set(sectionCounts).size >= 3, `section counts remain formulaic: ${sectionCounts.join(',')}`);
  assert.ok(firstPersonCount < 70, `first-person count remains dense: ${firstPersonCount}`);
});
