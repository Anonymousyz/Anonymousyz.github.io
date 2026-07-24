import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs');
const routes = [
  'index.html',
  'projects/index.html',
  'works/index.html',
  'about/index.html',
  'methods/index.html',
  'methods/learning/index.html',
  'methods/research-and-judgment/index.html',
  'methods/plural-thinking/index.html',
  'methods/writing/index.html',
  'methods/product-definition/index.html',
  'methods/visual-information-design/index.html',
  'methods/product-and-engineering/index.html',
  'systems/index.html',
  'cases/research-to-decision/index.html',
  '404.html',
];

for (const route of routes) await access(path.join(root, route));

const index = await readFile(path.join(root, 'index.html'), 'utf8');
const works = await readFile(path.join(root, 'works/index.html'), 'utf8');
const about = await readFile(path.join(root, 'about/index.html'), 'utf8');
const methods = await readFile(path.join(root, 'methods/index.html'), 'utf8');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');

const methodPages = [
  ['learning', '持续学习｜好奇心 · 目标 · 检验 · 调整'],
  ['research-and-judgment', '研究｜决策问题 · 证据链 · 结论树'],
  ['plural-thinking', '多元思维｜规律 · 工具 · 视角'],
  ['writing', '写作｜判断 · 证据 · 表达'],
  ['product-definition', '产品｜做什么 · 为什么做 · 验证什么'],
  ['visual-information-design', '视觉｜重点 · 秩序 · 取舍'],
  ['product-and-engineering', '工程｜稳定 · 维护 · 交付'],
];

const methodV3Requirements = new Map([
  ['/methods/', ['七项方法各自处理什么', '最常用的去处']],
  ['/methods/learning/', ['提取练习', '近迁移', '元认知监测']],
  ['/methods/research-and-judgment/', ['把几种做法放在一起比较', '先做一步可验证的行动', '结论要带上条件']],
  ['/methods/plural-thinking/', ['规模较小、结果可查、必要时可以撤回的行动', '通常先用一个主要工具']],
  ['/methods/writing/', ['写完以后检查四遍', '继续修改已经不会改变判断、结构或行动时']],
  ['/methods/product-definition/', ['明确不做的内容', '工程设计']],
  ['/methods/visual-information-design/', ['信息量和留白', '程序读取']],
  ['/methods/product-and-engineering/', ['工程设计和交付检查', '正式用户验收测试（UAT）']],
]);

const methodV3Forbidden = [
  'app.notion.com',
  'notion.so',
  '至少 3 条 L3',
  '总分 ≥ 28',
  '30 秒理解价值',
  '连续 4 周',
  '记忆保持率提升',
];

assert.match(index, /研究、项目与公开作品/);
assert.match(index, /从分析到决策/);
assert.match(index, /从技术到应用/);
assert.match(index, /两条工作主线/);
assert.match(index, /查看全部七项方法/);
assert.doesNotMatch(index, /长期主义者|终身学习者/);
assert.match(index, /工业绿色微电网评价软件/);
assert.match(index, /工业技术改造投资管理平台项目/);
assert.match(index, /口腔小程序项目/);
assert.doesNotMatch(index, /DeliveryRail|工作闭环|证据与公开边界/);
assert.match(index, /application\/ld\+json/);
assert.match(index, /og\/home\.png/);

assert.match(methods, /<h1>工作方法<\/h1>/);
assert.match(methods, /从分析到决策/);
assert.match(methods, /从技术到应用/);
assert.doesNotMatch(methods, /七个入口|不使用抽象标签|判断与实现/);

for (const [slug, title] of methodPages) {
  const content = await readFile(path.join(root, `methods/${slug}/index.html`), 'utf8');
  assert.match(content, new RegExp(title), `${slug} should include its method title`);
  assert.match(content, /本页目录/);
  assert.match(content, /适用边界/);
  assert.doesNotMatch(
    content,
    /工业绿色微电网|工业技术改造投资管理平台项目|口腔小程序/,
    `${slug} should not include project fragments`,
  );
  assert.match(sitemap, new RegExp(`<loc>https://decideandbuild\\.com/methods/${slug}/</loc>`));
}

for (const [route, requirements] of methodV3Requirements) {
  const relativePath = route === '/methods/'
    ? 'methods/index.html'
    : `${route.slice(1)}index.html`;
  const content = await readFile(path.join(root, relativePath), 'utf8');
  for (const requirement of requirements) {
    assert.ok(content.includes(requirement), `${route} should include ${requirement}`);
  }
}

assert.match(sitemap, /<loc>https:\/\/decideandbuild\.com\/methods\/<\/loc>/);

const learning = await readFile(path.join(root, 'methods/learning/index.html'), 'utf8');
assert.match(learning, /Learner®/);
assert.match(learning, /#1/);
assert.match(learning, /不能代替项目成果/);

assert.match(works, /v0\.6\.0/);
assert.match(works, /r2d validate brief\.json/);
assert.match(works, /ai-ready report assessment\.json/);
assert.match(works, /SoftwareSourceCode/);
assert.match(works, /og\/works\.png/);

assert.match(about, /过去八年，我做过产业研究、政策分析和重大项目/);

for (const file of ['home.png', 'projects.png', 'works.png', 'about.png']) {
  await access(path.join(root, 'og', file));
}

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const htmlFiles = await collectHtml(root);
const forbidden = [
  /能力证明/,
  /个人\s*OS/,
  /能力矩阵/,
  /认知引擎/,
  /赋能/,
  /闭环/,
  /抓手/,
  /全方位/,
  /多维度/,
  /显著提升/,
  /充分验证/,
  /风险可控/,
  /协同效率/,
  /方法论/,
  /好奇心把我带到新问题前/,
  /让业务规则在系统里有落点/,
  /我经常接手两类工作/,
  /一上来套模型/,
  /经营判断/,
  /工程化设计/,
  /原型界面/,
  /运营复盘/,
  /整理复用/,
  /形成完整体系/,
  /证明能力/,
  /接受公开检查/,
  new RegExp(String.fromCharCode(70, 68, 69) + '\\s*' + String.fromCharCode(27714, 32844), 'i'),
  new RegExp(['目标', '岗位'].join('')),
  /进入陌生领域/,
  /认知更新/,
  /学习迁移/,
  /LinkedIn|linkedin\.com/i,
  /[A-Z]:\\/,
  /(?:\d{1,3}\.){3}\d{1,3}/,
  /microgrid\.db/i,
  /password/i,
  /credential/i,
  /fonts\.googleapis/i,
  /fonts\.gstatic/i,
  /星标数/,
  /客户采用率/,
  /真实用户数量/,
  /已(?:完成|通过)正式 UAT/,
  /已(?:完成|通过)预生产/,
  /已(?:完成|通过)生产验收/,
];

for (const file of htmlFiles) {
  const content = await readFile(file, 'utf8');
  for (const pattern of forbidden) {
    assert.doesNotMatch(content, pattern, `${file} matched ${pattern}`);
  }
  for (const forbiddenText of methodV3Forbidden) {
    assert.equal(content.includes(forbiddenText), false, `${file} included ${forbiddenText}`);
  }
}

console.log(`Verified ${routes.length} routes and scanned ${htmlFiles.length} HTML files.`);
