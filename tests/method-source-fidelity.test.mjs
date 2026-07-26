import assert from 'node:assert/strict';
import test from 'node:test';

import { methodBySlug } from '../src/data/methods.mjs';

test('研究页保留决策问题、证据链和结论树的完整路径', () => {
  const article = methodBySlug['research-and-judgment'];
  assert.deepEqual(article.map.steps, [
    '说清要作的决定',
    '列出要核对的事实',
    '比较不同解释',
    '比较几种做法',
    '先做一步可验证的行动',
    '记录结果，按时复核',
  ]);
  assert.match(JSON.stringify(article), /摸情况|验判断|比方案/);
  assert.match(JSON.stringify(article), /证据记录表/);
  assert.match(JSON.stringify(article), /问题树/);
  assert.match(JSON.stringify(article), /什么时候停止研究/);
});

test('多元思维页区分规律、工具与人物视角', () => {
  const article = methodBySlug['plural-thinking'];
  const text = JSON.stringify(article);
  assert.match(article.lead, /^遇到复杂问题，我会换几个角度看一看，找出原判断可能漏掉的条件。/);
  assert.deepEqual(article.map.steps, [
    '目标：要解决什么问题',
    '事实：已经知道什么',
    '验证：下一步先做什么',
  ]);
  assert.match(text, /跨领域类比.*不能充当证据/);
  assert.match(text, /换个立场看问题/);
  assert.match(text, /不等于这些人真的参与过/);
});

test('学习、研究和写作页以明确的主体和动作开篇', () => {
  assert.match(
    methodBySlug.learning.lead,
    /^遇到拿不准的判断，或第一次接触的系统，我会去查它的依据和运行方式。/
  );
  assert.match(
    methodBySlug['research-and-judgment'].lead,
    /^研究是为一项具体决定服务的：谁来决定、何时决定、有哪些选择。/
  );
  assert.match(
    methodBySlug.writing.lead,
    /^写作一面帮我把判断理清，一面把它讲给读者。/
  );
});

test('写作页围绕判断、证据和表达组织不同写作强度', () => {
  const text = JSON.stringify(methodBySlug.writing);
  for (const term of [
    '先确定问题、判断和用途',
    '边写边探索',
    '先写主要判断',
    '日常沟通',
    '正式材料',
    '事实、解释、评价和建议',
    '检查四遍',
    '分四轮修改',
    '请读者复述',
  ]) {
    assert.match(text, new RegExp(term));
  }
});

test('产品、视觉和工程页回答不同层次的问题', () => {
  const product = methodBySlug['product-definition'];
  const visual = methodBySlug['visual-information-design'];
  const engineering = methodBySlug['product-and-engineering'];

  assert.match(product.lead, /^产品工作先回答一件事：/);
  assert.match(JSON.stringify(product), /立项判断|问题验证|方案验证|MVP|停止条件/);

  assert.match(visual.lead, /^视觉设计要让人找到重点、看懂关系、分清状态，也知道下一步怎么做。/);
  assert.deepEqual(visual.map.steps, [
    '先让信息好找',
    '同一含义用同一规则',
    '删去不服务任务的形式',
  ]);
  assert.match(JSON.stringify(visual), /信息量和留白|Design Tokens|快速检查|完整检查|程序读取/);
  assert.match(JSON.stringify(visual), /已经能说清设计规则和人工检查方法/);
  assert.match(JSON.stringify(visual), /程序可以先找出偏差/);

  assert.match(engineering.lead, /^交付一套系统，不只看代码能不能运行，还要看后来有没有人能维护、接手。/);
  assert.deepEqual(engineering.map.steps, [
    '立项判断',
    '问题验证',
    '方案验证',
    '工程设计',
    '迭代实现',
    '交付检查',
    '发布交付',
    '运行复查',
    '整理留存',
  ]);
  assert.match(JSON.stringify(engineering), /业务架构|应用架构|数据架构|技术架构/);
  assert.match(JSON.stringify(engineering), /AI Coding|代码审查|自动测试/);
});
