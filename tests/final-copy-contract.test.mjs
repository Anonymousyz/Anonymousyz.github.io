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

test('应用侧把未公开支撑的动作写成当前做法或检查项', () => {
  const product = JSON.stringify(methodArticles.find((item) => item.slug === 'product-definition'));
  const visual = JSON.stringify(methodArticles.find((item) => item.slug === 'visual-information-design'));
  const engineering = JSON.stringify(methodArticles.find((item) => item.slug === 'product-and-engineering'));

  assert.doesNotMatch(product, /我请目标使用者|我到工作现场|我和负责人约定样本/);
  assert.doesNotMatch(visual, /我请读者在限定时间|我用键盘走完主要流程/);
  assert.doesNotMatch(engineering, /每次合并都运行|技术人员监控关键接口/);
  assert.match(product, /目前采用的做法/);
  assert.match(visual, /检查项/);
  assert.match(engineering, /交付检查/);
});

test('七篇方法仍各自连接项目与具名公开作品', () => {
  assert.equal(methodArticles.length, 7);
  for (const article of methodArticles) {
    assert.ok(article.related.some((item) => item.href.startsWith('/projects/#')), article.slug);
    assert.ok(article.related.some((item) => /^https:\/\/github\.com\/Anonymousyz\//.test(item.href)), article.slug);
  }
});
