import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { methodArticles } from '../src/data/methods.mjs';
import * as portfolio from '../src/data/portfolio.mjs';

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

test('全站中文不用生硬包装和翻译腔', async () => {
  const visibleSources = await Promise.all([
    readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/projects.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/works.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/cases/research-to-decision.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/HomeMethodSystem.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/MethodArticle.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/MethodRelationship.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/ProjectIndex.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/ToolProof.astro', import.meta.url), 'utf8')
  ]);
  const text = [
    JSON.stringify(methodArticles),
    JSON.stringify(portfolio),
    ...visibleSources
  ].join('\n');

  for (const pattern of [
    /好奇心让问题不断扩展/,
    /先别选模型/,
    /人物视角是一种提问装置/,
    /视觉的甜蜜区/,
    /角色帽/,
    /质量门禁/,
    /从判断到沉淀/,
    /这一部分处理三件事/,
    /把判断放进可选行动中检验/,
    /达到当前决策所需的清晰度/,
    /这些方法怎样协作/,
    /项目背后反复使用的做法/
  ]) {
    assert.doesNotMatch(text, pattern);
  }
});

test('首页用具体经历和网站内容介绍自己', () => {
  assert.equal(
    portfolio.heroCopy,
    '过去八年，我做过产业研究、政策分析和重大项目，也参与过产品设计与软件建设。这个网站收录我的工作方法、公开工具和项目记录。'
  );
});