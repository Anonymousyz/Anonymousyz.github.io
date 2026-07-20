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
  '404.html'
];

for (const route of routes) {
  await access(path.join(root, route));
}

const index = await readFile(path.join(root, 'index.html'), 'utf8');
const works = await readFile(path.join(root, 'works/index.html'), 'utf8');
const about = await readFile(path.join(root, 'about/index.html'), 'utf8');
const methods = await readFile(path.join(root, 'methods/index.html'), 'utf8');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');

const methodPages = [
  ['learning', '持续学习'],
  ['research-and-judgment', '研究与证据'],
  ['plural-thinking', '多元思维'],
  ['writing', '写作与表达'],
  ['product-definition', '产品定义'],
  ['visual-information-design', '视觉与信息设计'],
  ['product-and-engineering', '工程与交付']
];

assert.match(index, /个人方法与项目实践/);
assert.match(index, /从分析到决策/);
assert.match(index, /从技术到应用/);
assert.match(index, /过去八年，我做过产业研究、政策分析和重大项目/);
for (const [, title] of methodPages) assert.match(index, new RegExp(title));
assert.match(index, /工业绿色微电网评价软件/);
assert.match(index, /总体所技改平台项目/);
assert.match(index, /口腔小程序项目/);
assert.doesNotMatch(index, /DeliveryRail|工作闭环|证据与公开边界/);
assert.match(index, /application\/ld\+json/);
assert.match(index, /og\/home\.png/);

assert.match(methods, /<h1>判断与实现<\/h1>/);
assert.doesNotMatch(methods, /这里记录我在研究、写作和系统建设中反复使用的做法/);
assert.match(methods, /从分析到决策/);
assert.match(methods, /从技术到应用/);
for (const [, title] of methodPages) assert.match(methods, new RegExp(title));

for (const [slug, title] of methodPages) {
  const content = await readFile(path.join(root, `methods/${slug}/index.html`), 'utf8');
  assert.match(content, new RegExp(title), `${slug} should include its method title`);
  assert.match(sitemap, new RegExp(`<loc>https://decideandbuild\\.com/methods/${slug}/</loc>`));
}
assert.match(sitemap, /<loc>https:\/\/decideandbuild\.com\/methods\/<\/loc>/);

const engineering = await readFile(
  path.join(root, 'methods/product-and-engineering/index.html'),
  'utf8'
);
assert.match(engineering, /正式 UAT、预生产和生产验收尚未完成/);
assert.doesNotMatch(engineering, /已(?:完成|通过)正式 UAT|已(?:完成|通过)预生产|已(?:完成|通过)生产验收/);

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
    if (entry.isDirectory()) {
      files.push(...await collectHtml(full));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
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
  /形成完整体系/,
  /证明能力/,
  /接受公开检查/,
  /FDE\s*求职/i,
  /目标岗位/,
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
  /已(?:完成|通过)生产验收/
];

for (const file of htmlFiles) {
  const content = await readFile(file, 'utf8');
  for (const pattern of forbidden) {
    assert.doesNotMatch(content, pattern, `${file} matched ${pattern}`);
  }
}

console.log(`Verified ${routes.length} routes and scanned ${htmlFiles.length} HTML files.`);
