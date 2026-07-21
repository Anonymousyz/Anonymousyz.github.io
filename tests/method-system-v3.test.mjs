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
    '界定决策问题',
    '建立证据地图',
    '形成竞争性解释',
    '比较行动选项',
    '设计最小可验证行动',
    '记录结果并复盘',
  ]);
  for (const term of [
    '不行动', '保守方案', '进取方案', '可逆性', '信息价值',
    '适用范围', '主要反方', '反证条件', '复核时间',
  ]) assert.match(articleText('research-and-judgment'), new RegExp(term));
});

test('多元思维把验证写成下一步行动', () => {
  const article = methodBySlug['plural-thinking'];
  assert.deepEqual(article.map.steps, [
    '目标：真正要解决什么',
    '事实：已经确认什么',
    '验证：下一步怎样行动',
  ]);
  assert.match(articleText('plural-thinking'), /最小、可验证、可撤回的行动/);
  assert.match(articleText('plural-thinking'), /默认使用一个主工具/);
  assert.match(articleText('plural-thinking'), /不再改变判断或行动时停止/);
});

test('学习页区分个人偏好、参考方法和实际证据', () => {
  const text = articleText('learning');
  for (const term of ['主动检索', '费曼检验', '迁移', '元认知']) {
    assert.match(text, new RegExp(term));
  }
  assert.match(text, /参考方法/);
  assert.match(text, /不表示这些方法已经形成长期个人证据/);
  assert.doesNotMatch(text, /记忆保持率|≥\s*85%|学习 KPI|25 分钟/);
});

test('写作、产品、视觉和工程保留各自的选择与停止规则', () => {
  assert.match(articleText('writing'), /新增检查不再改变判断、结构或行动时停止/);
  assert.match(articleText('product-definition'), /不做清单|工程化设计入口/);
  assert.match(articleText('visual-information-design'), /甜蜜区|机器可读|正在形成/);
  assert.match(articleText('product-and-engineering'), /工程化设计和质量门禁/);
});

test('方法关系只描述主要阅读关系和跨主线使用', () => {
  assert.deepEqual(methodRelationships.paths.map((path) => path.items.map((item) => item.title)), [
    ['研究', '多元思维', '写作'],
    ['产品', '视觉', '工程'],
  ]);
  assert.match(methodRelationships.note, /顺序表示主要阅读关系/);
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
