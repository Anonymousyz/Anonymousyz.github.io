import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  analysisMethods,
  applicationMethods,
  learningMethod,
  methodBySlug,
  methodArticles,
} from '../src/data/methods.mjs';

const expectedTitles = new Map([
  ['research-and-judgment', '研究｜决策问题 · 证据链 · 结论树'],
  ['plural-thinking', '多元思维｜规律 · 工具 · 视角'],
  ['writing', '写作｜判断 · 证据 · 表达'],
  ['product-definition', '产品｜做什么 · 为什么做 · 验证什么'],
  ['visual-information-design', '视觉｜功能 · 一致性 · 删除'],
  ['product-and-engineering', '工程｜怎么做稳 · 怎么维护 · 怎么交付'],
]);

test('六个专业方法页采用来自 Notion 的公开措辞与长文结构', () => {
  assert.equal(analysisMethods.length, 3);
  assert.equal(applicationMethods.length, 3);

  for (const [slug, title] of expectedTitles) {
    const article = methodBySlug[slug];
    assert.ok(article, `缺少方法文章：${slug}`);
    assert.equal(article.title, title);
    assert.ok(article.lead.length >= 40, `${slug} 的导语过短`);
    assert.ok(article.map.steps.length >= 3, `${slug} 缺少方法路径`);
    assert.ok(article.sections.length >= 4, `${slug} 的正文深度不足`);
    assert.ok(article.sections.every((section) => section.id && section.heading));
    assert.ok(article.sections.every((section) => section.paragraphs.length >= 1));
    assert.ok(article.boundaries.length >= 2, `${slug} 缺少适用边界`);
    assert.equal('related' in article, false, `${slug} 不应包含项目片段`);
  }
});

test('专业方法层不夹带项目证据', () => {
  const serialized = JSON.stringify(
    [...expectedTitles.keys()].map((slug) => methodBySlug[slug]),
  );

  for (const forbidden of ['工业绿色微电网', '工业技术改造投资管理平台项目', '口腔小程序', '项目片段']) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test('学习页说明测评结果，也写明证据边界', () => {
  assert.equal(learningMethod.article.assessment.theme, 'Learner®');
  assert.equal(learningMethod.article.assessment.rank, '#1');
  assert.match(
    learningMethod.article.assessment.sourceUrl,
    /^https:\/\/www\.gallup\.com\//,
  );
  assert.match(learningMethod.article.assessment.boundary, /不替代项目成果/);
  assert.equal('related' in learningMethod.article, false);
});

test('方法文章保留七个既有路由', () => {
  assert.deepEqual(
    methodArticles.map((article) => article.slug),
    [
      'learning',
      'research-and-judgment',
      'plural-thinking',
      'writing',
      'product-definition',
      'visual-information-design',
      'product-and-engineering',
    ],
  );
});

test('方法详情页呈现目录、方法路径、适用边界和可选来源', async () => {
  const source = await readFile(
    new URL('../src/components/MethodArticle.astro', import.meta.url),
    'utf8',
  );

  assert.match(source, /class="method-article__toc"/);
  assert.match(source, /aria-label="本页目录"/);
  assert.match(source, /href=\{`#\$\{section\.id\}`\}/);
  assert.match(source, /class="method-map"/);
  assert.match(source, /article\.map\.steps/);
  assert.match(source, /class="method-boundaries"/);
  assert.match(source, /article\.assessment/);
  assert.match(source, /article\.publicOutputs\?\.length > 0/);
  assert.doesNotMatch(source, /article\.related|相关内容/);
});

test('方法索引用标题和副标题建立层级，不再渲染项目延伸阅读', async () => {
  const source = await readFile(
    new URL('../src/components/MethodIndex.astro', import.meta.url),
    'utf8',
  );

  assert.match(source, /learning\.subtitle/);
  assert.match(source, /method\.subtitle/);
  assert.doesNotMatch(source, /showRelated|track\.related|method-track__related/);
});

test('方法总页使用“工作方法”，首页用两条主线作为入口', async () => {
  const [home, hub] = await Promise.all([
    readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/methods/index.astro', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /<h2>两条工作主线<\/h2>/);
  assert.doesNotMatch(home, /七个入口|不使用抽象标签/);
  assert.match(hub, /<h1>工作方法<\/h1>/);
  assert.doesNotMatch(hub, /showRelated|判断与实现/);
});

test('方法总页呈现关系图，首页仍保持轻量', async () => {
  const [home, hub] = await Promise.all([
    readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/methods/index.astro', import.meta.url), 'utf8'),
  ]);
  assert.doesNotMatch(home, /MethodRelationship/);
  assert.match(hub, /MethodRelationship/);
  assert.match(hub, /relationships=\{methodRelationships\}/);
});
