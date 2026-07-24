import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  methodBySlug,
  methodRelationships,
} from '../src/data/methods.mjs';

function articleText(slug) {
  return JSON.stringify(methodBySlug[slug]);
}

test('研究页从证据继续走到行动与复盘', () => {
  const article = methodBySlug['research-and-judgment'];
  assert.deepEqual(article.map.steps, [
    '说清要作的决定',
    '列出要核对的事实',
    '比较不同解释',
    '比较几种做法',
    '先做一步可验证的行动',
    '记录结果，按时复核',
  ]);
  for (const term of [
    '不行动', '谨慎试行', '较大投入', '撤回', '能多知道什么',
    '适用范围', '主要反方', '反证条件', '复核时间',
  ]) assert.match(articleText('research-and-judgment'), new RegExp(term));
});

test('多元思维把验证写成下一步行动', () => {
  const article = methodBySlug['plural-thinking'];
  assert.deepEqual(article.map.steps, [
    '目标：要解决什么问题',
    '事实：已经知道什么',
    '验证：下一步先做什么',
  ]);
  assert.match(articleText('plural-thinking'), /规模较小、结果可查、必要时可以撤回的行动/);
  assert.match(articleText('plural-thinking'), /通常先用一个主要工具/);
  assert.match(articleText('plural-thinking'), /再加一个模型也不会改变判断和行动时/);
});

test('学习页区分个人偏好、参考方法和实际证据', () => {
  const text = articleText('learning');
  for (const term of ['提取练习', '近迁移', '远迁移', '元认知监测']) {
    assert.match(text, new RegExp(term));
  }
  assert.match(text, /学习方法只在需要时使用/);
  assert.match(text, /只能说明偏好与过程/);
  assert.doesNotMatch(text, /记忆保持率|≥\s*85%|学习 KPI|25 分钟/);
});

test('写作、产品、视觉和工程保留各自的选择与停止规则', () => {
  assert.match(articleText('writing'), /继续修改已经不会改变判断、结构或行动时/);
  assert.match(articleText('product-definition'), /明确不做的内容|工程设计/);
  assert.match(articleText('visual-information-design'), /信息量和留白|程序读取|仍在整理/);
  assert.match(articleText('product-and-engineering'), /工程设计和交付检查/);
});

test('方法关系只描述主要阅读关系和跨主线使用', () => {
  assert.deepEqual(methodRelationships.paths.map((path) => path.items.map((item) => item.title)), [
    ['研究', '多元思维', '写作'],
    ['产品', '视觉', '工程'],
  ]);
  assert.match(methodRelationships.note, /最常用的去处/);
  assert.doesNotMatch(methodRelationships.note, /箭头/);
  assert.match(methodRelationships.note, /多元思维.*产品和工程/);
  assert.match(methodRelationships.note, /视觉.*研究材料.*软件界面/);
});

test('关系图区使用全站链接但不生成另一套局部编号', async () => {
  const source = await readFile(
    new URL('../src/components/MethodRelationship.astro', import.meta.url),
    'utf8',
  );
  const items = methodRelationships.paths.flatMap((path) => path.items);

  assert.equal(items.every((item) => item.href.startsWith('/methods/')), true);
  assert.doesNotMatch(source, /padStart|index\s*\+\s*1/);
  assert.match(source, /href=\{item\.href\}/);
  assert.match(source, /class="method-relationship__notes"/);
});

test('公开方法数据不包含私人来源和未经核验阈值', () => {
  const text = JSON.stringify(methodBySlug);
  for (const forbidden of [
    'app.notion.com', 'notion.so', '至少 3 条 L3', '总分 ≥ 28',
    '30 秒理解价值', '连续 4 周', '记忆保持率提升',
  ]) assert.equal(text.includes(forbidden), false, forbidden);
});

test('详情页支持少量定义列表而不要求所有章节使用', async () => {
  const source = await readFile(
    new URL('../src/components/MethodArticle.astro', import.meta.url),
    'utf8',
  );
  assert.match(source, /section\.definitions/);
  assert.match(source, /class="method-definitions"/);
  assert.match(source, /<dt>\{item\.term\}<\/dt>/);
  assert.match(source, /<dd>\{item\.description\}<\/dd>/);
});
