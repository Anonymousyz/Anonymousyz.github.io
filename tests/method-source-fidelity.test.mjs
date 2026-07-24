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
  assert.match(article.lead, /^模型和思维工具用来提问，不能代替事实。/);
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
    /^好奇心让我愿意追问，但学习的先后由手头的问题决定。/
  );
  assert.match(
    methodBySlug['research-and-judgment'].lead,
    /^研究先要弄清：谁来决定、何时决定、有哪些选择。/
  );
  assert.match(
    methodBySlug.writing.lead,
    /^写作既帮助自己形成判断，也要让读者看懂并用得上。/
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

  assert.match(product.lead, /^产品工作从一个具体问题开始：/);
  assert.match(JSON.stringify(product), /立项判断|问题验证|方案验证|MVP|停止条件/);

  assert.match(visual.lead, /^视觉设计首先帮助人找到重点、看懂关系、分清状态、完成操作。/);
  assert.deepEqual(visual.map.steps, [
    '先让信息好找',
    '同一含义用同一规则',
    '删去不服务任务的形式',
  ]);
  assert.match(JSON.stringify(visual), /信息量和留白|Design Tokens|快速检查|完整检查|程序读取/);
  assert.match(JSON.stringify(visual), /已经能说清设计规则和人工检查方法/);
  assert.match(JSON.stringify(visual), /程序可以先找出偏差/);

  assert.match(engineering.lead, /^系统交付时，代码要能运行，后续也要有人维护、有人接手。/);
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
