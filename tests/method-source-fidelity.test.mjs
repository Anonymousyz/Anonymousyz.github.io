import assert from 'node:assert/strict';
import test from 'node:test';

import { methodBySlug } from '../src/data/methods.mjs';

test('研究页保留决策问题、证据链和结论树的完整路径', () => {
  const article = methodBySlug['research-and-judgment'];
  assert.deepEqual(article.map.steps, [
    '界定决策问题',
    '建立证据地图',
    '形成竞争性解释',
    '比较行动选项',
    '设计最小可验证行动',
    '记录结果并复盘',
  ]);
  assert.match(JSON.stringify(article), /探索性研究|假设检验|决策支持/);
  assert.match(JSON.stringify(article), /Evidence Log/);
  assert.match(JSON.stringify(article), /问题树/);
  assert.match(JSON.stringify(article), /停止条件/);
});

test('多元思维页区分规律、工具与人物视角', () => {
  const article = methodBySlug['plural-thinking'];
  const text = JSON.stringify(article);
  assert.match(article.lead, /^先别选模型，先还原问题/);
  assert.deepEqual(article.map.steps, [
    '目标：真正要解决什么',
    '事实：已经确认什么',
    '验证：下一步怎样行动',
  ]);
  assert.match(text, /跨领域类比.*不能直接构成证明/);
  assert.match(text, /人物视角.*只负责提出问题/);
  assert.match(text, /不代表真实人物参与/);
});

test('学习、研究和写作页以明确的主体和动作开篇', () => {
  assert.match(
    methodBySlug.learning.lead,
    /^我对新领域有兴趣，也愿意花时间把问题弄明白。学习时，我先写清要能解释、判断或完成什么，/
  );
  assert.match(
    methodBySlug['research-and-judgment'].lead,
    /^研究先界定谁要在什么条件下作出什么决定。我再建立证据地图，/
  );
  assert.match(
    methodBySlug.writing.lead,
    /^写作先处理一个真实问题：形成判断、组织证据，让特定读者看懂并能据此行动。/
  );
});

test('写作页围绕判断、证据和表达组织不同写作强度', () => {
  const text = JSON.stringify(methodBySlug.writing);
  for (const term of [
    '问题、判断和用途',
    '探索驱动',
    '结论驱动',
    '轻量写作',
    '正式写作',
    '事实、解释、评价和建议',
    '四道质量门',
    '四轮修改',
    '读者复述',
  ]) {
    assert.match(text, new RegExp(term));
  }
});

test('产品、视觉和工程页回答不同层次的问题', () => {
  const product = methodBySlug['product-definition'];
  const visual = methodBySlug['visual-information-design'];
  const engineering = methodBySlug['product-and-engineering'];

  assert.match(product.lead, /^做产品时，我先回答三件事：做什么、为什么做、验证什么。/);
  assert.match(JSON.stringify(product), /经营判断|问题验证|方案验证|MVP|停止条件/);

  assert.match(visual.lead, /^视觉规则帮助读者找到重点、理解关系、辨认状态并完成动作。/);
  assert.deepEqual(visual.map.steps, [
    '功能先于美学',
    '一致性先于创造',
    '删除先于添加',
  ]);
  assert.match(JSON.stringify(visual), /甜蜜区|Design Tokens|快速检查|完整诊断|机器可读/);
  assert.match(JSON.stringify(visual), /现在我能说明设计语义和人工检查方向/);
  assert.match(JSON.stringify(visual), /自动化先找出偏差/);

  assert.match(engineering.lead, /^工程这一部分处理三件事：怎么做稳、怎么维护、怎么交付。/);
  assert.deepEqual(engineering.map.steps, [
    '经营判断',
    '问题验证',
    '方案验证',
    '工程化设计',
    '迭代实现',
    '质量门禁',
    '发布交付',
    '运营复盘',
    '资产沉淀',
  ]);
  assert.match(JSON.stringify(engineering), /业务架构|应用架构|数据架构|技术架构/);
  assert.match(JSON.stringify(engineering), /AI Coding|代码审查|自动测试/);
});
