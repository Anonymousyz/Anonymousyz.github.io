import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  identityProfiles,
  methodArticles,
  methodBySlug,
  methodSystem
} from '../src/data/methods.mjs';
import * as portfolio from '../src/data/portfolio.mjs';

const {
  demos,
  evidenceStates,
  featuredCase,
  heroCopy,
  positioning,
  projects,
  tools,
  workLoop
} = portfolio;

const expectedMethodSlugs = [
  methodSystem.learning.slug,
  ...methodSystem.tracks.flatMap((track) => track.methods.map((item) => item.slug))
];

test('身份只保留两个确认定义和可核对引文', () => {
  assert.equal(identityProfiles.length, 2);
  assert.deepEqual(
    identityProfiles.map(({
      title,
      quote,
      attribution,
      englishQuote,
      englishAttribution,
      sourceUrl
    }) => ({
      title,
      quote,
      attribution,
      englishQuote,
      englishAttribution,
      sourceUrl
    })),
    [
      {
        title: '长期主义者',
        quote: '无欲速，无见小利。欲速则不达，见小利则大事不成。',
        attribution: '孔子《论语·子路》',
        englishQuote: "It's All About the Long Term.",
        englishAttribution: 'Jeff Bezos，1997 Letter to Shareholders',
        sourceUrl: 'https://ir.aboutamazon.com/files/doc_financials/annual/2002_shareholderLetter.pdf'
      },
      {
        title: '终身学习者',
        quote: '学不可以已。',
        attribution: '荀子《劝学》',
        englishQuote: 'Stay hungry. Stay foolish.',
        englishAttribution: 'Whole Earth Catalog，Steve Jobs 2005 年斯坦福演讲引述',
        sourceUrl: 'https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish'
      }
    ]
  );
});

test('一级定位保持用户确认的原文', () => {
  assert.deepEqual(positioning, ['从分析到决策', '从技术到应用']);
});

test('首页事实说明保持确认稿', () => {
  assert.equal(
    heroCopy,
    '过去八年，我做过产业研究、政策分析和重大项目，也参与过产品设计与软件建设。这个网站收录我的工作方法、公开工具和项目记录。'
  );
});

test('首页项目固定为一个主案例和两份项目记录', () => {
  assert.equal(featuredCase.title, '工业绿色微电网评价软件');
  assert.equal(featuredCase.href, '/projects/#industrial-energy-carbon-system');
  assert.deepEqual(demos.map((item) => item.title), [
    '工业技术改造投资管理平台项目',
    '口腔小程序项目'
  ]);
  assert.deepEqual(demos.map((item) => item.href), [
    '/projects/#industrial-digital-public-service-platform',
    '/projects/#oral-care-mini-program'
  ]);
  assert.deepEqual(demos.map((item) => item.kind), ['内部功能版本 · 原型界面', '受控演示版 · 原型界面']);

  const techReform = projects.find((item) => item.id === 'industrial-digital-public-service-platform');
  assert.match(techReform.summary, /项目方案、建设任务和预算.*台账、权限、状态和工作台/);
  assert.match(techReform.deliveryPath, /政策与产业问题.*项目方案与任务.*角色与对象.*审批流程.*权限、状态与工作台/);
  assert.match(techReform.results.join(''), /申报与论证材料.*内部功能版本/);
});

test('学习和分析主线不使用包装性术语', () => {
  const text = JSON.stringify(methodArticles.filter((item) =>
    ['learning', 'analysis-to-decision'].includes(item.track)
  ));
  assert.doesNotMatch(
    text,
    /进入陌生领域|认知升级|学习闭环|学习迁移|认知模型库|专业背书|赋能|不是[^。；]*而是|真正的|这套方法|闭环|个人\s*OS|能力矩阵|认知引擎|形成完整体系|证明能力|接受公开检查/
  );
  assert.match(text, /事实/);
  assert.match(text, /解释/);
  assert.match(text, /评价/);
  assert.match(text, /建议/);
});

test('工作闭环按确认顺序提供具体动作', () => {
  assert.deepEqual(workLoop.map((item) => item.title), [
    '问题界定',
    '范围确定',
    '设计建设',
    '验证交付',
    '整理复用'
  ]);

  for (const item of workLoop) {
    assert.match(item.description, /。$/);
  }
});

test('代表项目顺序固定', () => {
  assert.deepEqual(projects.map((item) => item.title), [
    '工业绿色微电网评价软件',
    '工业技术改造投资管理平台项目',
    '口腔小程序项目'
  ]);
});

test('项目页包含三个确认项目且不使用能力证明标签', async () => {
  const source = await readFile(new URL('../src/pages/projects.astro', import.meta.url), 'utf8');
  assert.deepEqual(projects.slice(0, 3).map((item) => item.id), [
    'industrial-energy-carbon-system',
    'industrial-digital-public-service-platform',
    'oral-care-mini-program'
  ]);
  assert.doesNotMatch(source, /EvidenceBadge|能力证明|成熟度/);
  assert.match(source, /project\.deliveryPath/);
  assert.match(source, /project\.publicScope/);
  assert.match(source, /工作路径/);
  assert.match(source, /公开范围/);
  assert.match(source, /不公开项目附件/);
  assert.doesNotMatch(source, /验证证据|可展示内容/);
});

test('代表项目提供交付路径和公开说明范围', () => {
  for (const project of projects) {
    assert.ok(project.deliveryPath.length > 0);
    assert.ok(project.publicScope.length >= 3);
  }
});

test('两份数字化项目以两张脱敏原型快照说明流程与公开边界', () => {
  const prototypeProjects = projects.filter((project) => project.prototypeShowcase);
  assert.deepEqual(prototypeProjects.map((project) => project.id), [
    'industrial-digital-public-service-platform',
    'oral-care-mini-program'
  ]);

  for (const project of prototypeProjects) {
    assert.match(project.prototypeShowcase.status, /原型界面/);
    assert.ok(project.prototypeShowcase.intro.length > 0);
    assert.equal(project.prototypeShowcase.images.length, 2);

    for (const image of project.prototypeShowcase.images) {
      assert.match(image.src, /^\/images\/projects\//);
      assert.ok(image.alt.length > 0);
      assert.ok(image.label.length > 0);
      assert.ok(image.explanation.length > 0);
      assert.ok(image.boundary.length > 0);
      assert.doesNotMatch([image.explanation, image.boundary].join(' '), /公开生产运行|正式验收完成|已上线/);
    }
  }
});

test('项目页在公开边界内渲染原型快照，不导向私有运行环境', async () => {
  const source = await readFile(new URL('../src/pages/projects.astro', import.meta.url), 'utf8');
  assert.match(source, /project\.prototypeShowcase/);
  assert.match(source, /project-prototype-showcase/);
  assert.match(source, /image\.boundary/);
  assert.doesNotMatch(source, /target=/);
});

test('原型快照以全宽原图和图下紧凑双栏说明呈现', async () => {
  const source = await readFile(new URL('../src/pages/projects.astro', import.meta.url), 'utf8');
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');

  assert.match(source, /class="project-prototype-showcase__description"/);
  assert.match(source, /class="project-prototype-showcase__boundary"/);
  assert.match(css, /\.project-prototype-showcase__grid\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  assert.match(css, /\.project-prototype-showcase__item figcaption\s*\{[^}]*grid-template-columns:/s);
  assert.doesNotMatch(css, /\.project-prototype-showcase__item img\s*\{[^}]*(?:aspect-ratio|object-fit)/s);
});

test('原型快照为图片保留真实尺寸以避免布局跳动', async () => {
  const source = await readFile(new URL('../src/pages/projects.astro', import.meta.url), 'utf8');
  const prototypeProjects = projects.filter((project) => project.prototypeShowcase);

  for (const project of prototypeProjects) {
    for (const image of project.prototypeShowcase.images) {
      assert.ok(Number.isInteger(image.width) && image.width > 0);
      assert.ok(Number.isInteger(image.height) && image.height > 0);
    }
  }

  assert.match(source, /width={image.width}/);
  assert.match(source, /height={image.height}/);
});

test('证据状态只有三种', () => {
  assert.deepEqual(evidenceStates.map((item) => item.label), [
    '可公开复查',
    '真实项目，内容已脱敏',
    '尚待外部验证'
  ]);
});

test('公开作品保留四个入口', () => {
  assert.equal(tools.length, 4);
  for (const tool of tools) {
    assert.match(tool.href, /^https:\/\/github\.com\/Anonymousyz\//);
  }
});

test('公开作品提供版本、检查路径和方法边界', () => {
  assert.deepEqual(tools.map((item) => item.version), ['v0.6.0', 'v0.6.0', '持续维护', 'v0.7.0']);

  for (const tool of tools) {
    assert.ok(tool.runtime.length > 0);
    assert.ok(tool.quickStart.items.length > 0);
    assert.ok(tool.proofTypes.length >= 3);
    assert.ok(tool.methodBoundary.length > 0);
  }
});

test('首页公开作品摘要保持确认稿', () => {
  assert.deepEqual(tools.map((item) => item.homeSummary), [
    '一组用于界定研究问题、整理证据和比较方案的模板。',
    '帮助团队检查 AI 原型进入真实业务前还缺什么。',
    '收录 AI 系统用于生产前可参考的工程和治理资料。',
    '一套供方案、报告和技术文档署名前使用的审稿标准。'
  ]);
});

test('首页按方法、项目和公开作品组织内容', async () => {
  const source = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(source, /HomeMethodSystem/);
  assert.match(source, /ProjectIndex/);
  assert.match(source, /PublicWorkIndex/);
  assert.match(source, /heroCopy/);
  assert.match(source, /id="methods"/);
  assert.match(source, /一个完整案例，两项脱敏项目记录/);
  assert.doesNotMatch(source, /能力证明|成熟度/);
  assert.doesNotMatch(source, /DeliveryRail|WorkLoop|EvidenceBadge/);
});

test('作品页只从集中数据渲染公开工具', async () => {
  const source = await readFile(new URL('../src/pages/works.astro', import.meta.url), 'utf8');
  assert.match(source, /ToolProof/);
  assert.match(source, /tools\.map/);
  assert.doesNotMatch(source, /70分结构和8个否决条件/);
  assert.doesNotMatch(source, /evidence-legend/);
});

test('研究案例页保留版本和编辑式标题', async () => {
  const source = await readFile(new URL('../src/pages/cases/research-to-decision.astro', import.meta.url), 'utf8');
  assert.match(source, /Research-to-Decision Toolkit · v0\.6\.0/);
  assert.match(source, /怎样把研究材料整理成/);
  assert.match(source, /可以直接查看和运行的内容/);
  assert.match(source, /公开工具案例/);
  assert.doesNotMatch(source, /旗舰案例|不是没有资料，而是|不把.*包装成|下一步不是|最终判断仍由负责人/);
});

test('404 页保留三个恢复入口', async () => {
  const source = await readFile(new URL('../src/pages/404.astro', import.meta.url), 'utf8');
  assert.match(source, /href="\/">返回首页<\/a>/);
  assert.match(source, /href="\/projects\/">查看项目<\/a>/);
  assert.match(source, /href="\/works\/">查看公开作品<\/a>/);
});

test('研究案例工作流覆盖旧深色样式', async () => {
  const editorial = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(editorial, /\.case-workflow \.section-heading > p, \.case-stages p \{ color: var\(--editorial-muted\); \}/);
  assert.match(editorial, /\.case-stages \{ border-top-color: var\(--editorial-rule\); \}/);
  assert.match(editorial, /\.case-stages article \{ border-bottom-color: var\(--editorial-soft\); \}/);
  assert.match(editorial, /\.case-stages article \+ article \{ border-left-color: var\(--editorial-soft\); \}/);
  assert.match(editorial, /\.case-stages span \{ color: var\(--editorial-accent\); \}/);
  assert.match(editorial, /\.button-primary\s*\{[^}]*box-shadow: none;/s);
  assert.match(editorial, /\.button:hover\s*\{[^}]*transform: none;/s);
  assert.match(editorial, /\.proof-chip\s*\{[^}]*border: 0;[^}]*background: transparent;/s);
  assert.match(editorial, /\.validation-label\s*\{[^}]*background: transparent;/s);
  assert.match(editorial, /\.site-footer nav span\s*\{[^}]*display: inline;[^}]*font: inherit;/s);
  assert.match(editorial, /@media \(max-width: 560px\)[\s\S]*?\.validation-item\s*\{[^}]*grid-template-columns: 1fr;/s);
  assert.match(editorial, /@media \(max-width: 560px\)[\s\S]*?\.validation-item ul\s*\{[^}]*grid-column: 1;/s);
});

test('sitemap 收录方法总页和七个方法页', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  for (const pathname of [
    '/methods/',
    ...expectedMethodSlugs.map((slug) => `/methods/${slug}/`)
  ]) {
    assert.match(sitemap, new RegExp(`<loc>https://decideandbuild\\.com${pathname}</loc>`));
  }
});

test('构建验证保留完整禁用词和边界扫描', async () => {
  const source = await readFile(new URL('../scripts/verify-build.mjs', import.meta.url), 'utf8');
  for (const fragment of [
    '/个人\\s*OS/',
    '/能力矩阵/',
    '/认知引擎/',
    '/赋能/',
    '/闭环/',
    '/形成完整体系/',
    '/证明能力/',
    '/接受公开检查/'
  ]) {
    assert.ok(source.includes(fragment), `verify-build missing ${fragment}`);
  }
});

async function createLinkFixture(t, files) {
  const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-links-'));
  t.after(() => rm(fixtureRoot, { recursive: true, force: true }));

  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(fixtureRoot, 'docs', relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content, 'utf8');
  }

  return fixtureRoot;
}

function runLinkVerifier(cwd) {
  const script = fileURLToPath(new URL('../scripts/verify-links.mjs', import.meta.url));
  return spawnSync(process.execPath, [script], { cwd, encoding: 'utf8' });
}

test('链接检查器在临时站点解析路由、查询、编码、文件和锚点', async (t) => {
  const fixtureRoot = await createLinkFixture(t, {
    'index.html': `
      <main id="home">
        <a href="/about/?from=home#section">绝对路由</a>
        <a href="guide%20file.html?version=1#part%201">编码文件</a>
        <a href="/assets/site.css?v=20260720">静态文件</a>
        <a href="#home">同页锚点</a>
        <a href="https://github.com/Anonymousyz/example?tab=readme">GitHub</a>
        <a href="https://ir.aboutamazon.com/files/doc_financials/annual/2002_shareholderLetter.pdf">Amazon</a>
        <a href="https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish">Stanford</a>
      </main>`,
    'about/index.html': '<h1 id="section">关于</h1>',
    'guide file.html': '<h1 id="part 1">说明</h1>',
    'assets/site.css': 'body { color: black; }',
    'methods/index.html': `
      <a href="../about/?via=relative#section">相对路由</a>
      <a href="./topic/?from=hub#entry">尾斜线路由</a>
      <a href="https://decideandbuild.com/about/#section">站内绝对 URL</a>`,
    'methods/topic/index.html': '<h1 id="entry">方法</h1>'
  });

  const result = runLinkVerifier(fixtureRoot);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.trim(),
    'Verified internal links, anchors, and approved external URLs.'
  );
});

test('链接检查器对坏锚点返回可定位的非零错误', async (t) => {
  const fixtureRoot = await createLinkFixture(t, {
    'index.html': '<a href="/about/#missing">坏锚点</a>',
    'about/index.html': '<h1 id="present">关于</h1>'
  });

  const result = runLinkVerifier(fixtureRoot);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /index\.html/);
  assert.match(result.stderr, /href="\/about\/#missing"/);
  assert.match(result.stderr, /about[\\/]index\.html#missing/);
  assert.match(result.stderr, /missing id="missing"/);
});

test('链接检查器拒绝路径逃逸并说明原因', async (t) => {
  const fixtureRoot = await createLinkFixture(t, {
    'index.html': '<a href="/%2e%2e%5coutside.html">路径逃逸</a>'
  });

  const result = runLinkVerifier(fixtureRoot);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /index\.html/);
  assert.match(result.stderr, /href="\/%2e%2e%5coutside\.html"/);
  assert.match(result.stderr, /target leaves docs root/);
});

test('链接检查器拒绝未知外链并说明原因', async (t) => {
  const fixtureRoot = await createLinkFixture(t, {
    'index.html': '<a href="https://example.com/unapproved">未知外链</a>'
  });

  const result = runLinkVerifier(fixtureRoot);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /index\.html/);
  assert.match(result.stderr, /href="https:\/\/example\.com\/unapproved"/);
  assert.match(result.stderr, /external URL is not approved/);
});

test('关于页用两条主线说明工作范围', async () => {
  const about = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');
  assert.match(about, /positioning\[0\]/);
  assert.match(about, /positioning\[1\]/);
  assert.match(about, />我经常接手两类工作</);
  assert.match(about, />我在项目里做什么</);
  assert.match(about, />公开内容</);
  assert.match(about, />联系</);
  assert.match(about, /href="\/projects\/#industrial-energy-carbon-system"/);
  assert.match(about, /href="\/methods\/research-and-judgment\/"/);
  assert.match(about, /GitHub/);
});

test('网站不再包含 LinkedIn 入口或结构化数据', async () => {
  const sources = await Promise.all([
    readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SiteFooter.astro', import.meta.url), 'utf8')
  ]);
  for (const source of sources) {
    assert.doesNotMatch(source, /LinkedIn|linkedin\.com/i);
  }
});

test('兼容页仍链接到项目页', async () => {
  const systems = await readFile(new URL('../src/pages/systems.astro', import.meta.url), 'utf8');
  assert.match(systems, /href="\/projects\/"/);
});

test('共享布局支持大图分享卡和结构化数据', async () => {
  const source = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
  assert.match(source, /summary_large_image/);
  assert.match(source, /og:image/);
  assert.match(source, /application\/ld\+json/);
  assert.match(source, /structuredData/);
});

test('集中内容不包含私域话术、私有路径或运行信息', async () => {
  const source = await readFile(new URL('../src/data/portfolio.mjs', import.meta.url), 'utf8');
  const forbidden = [
    new RegExp(String.fromCharCode(70, 68, 69) + '\\s*' + String.fromCharCode(27714, 32844), 'i'),
    new RegExp(['目标', '岗位'].join('')),
    /[A-Z]:\\/,
    /(?:https?:\/\/)?(?:\d{1,3}\.){3}\d{1,3}/,
    /password/i,
    /credential/i,
    /microgrid\.db/i
  ];

  for (const pattern of forbidden) {
    assert.doesNotMatch(source, pattern);
  }
});

test('共享布局使用编辑式页面外框', async () => {
  const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
  const header = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');
  const footer = await readFile(new URL('../src/components/SiteFooter.astro', import.meta.url), 'utf8');
  const editorial = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');

  assert.match(layout, /editorial\.css/);
  assert.match(layout, /page-frame/);
  assert.match(layout, /#f4f1e9/);
  assert.match(header, /label: '方法'/);
  assert.match(header, /href: '\/methods\/'/);
  assert.doesNotMatch(header, /brand-mark/);
  assert.match(footer, /GitHub/);
  assert.match(editorial, /\.hero h1 em\s*\{[^}]*color: inherit;[^}]*font-style: normal;[^}]*font-weight: inherit;/s);
  assert.deepEqual(editorial.match(/\.article-shell\s*\{[^}]*\}/g), [
    '.article-shell { width: min(1080px, calc(100% - 76px)); margin-inline: auto; }'
  ]);
});

test('首页不再呈现身份定义，身份说明仅保留在关于页', async () => {
  const source = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /HomeIdentityStrip|identityProfiles|id="identity"/);
  assert.match(source, /<p class="editorial-eyebrow">研究、项目与公开作品<\/p>/);
  assert.match(source, /<p class="editorial-lead">\{heroCopy\}<\/p>/);
  assert.ok(source.indexOf('editorial-hero') < source.indexOf('id="methods"'));
  assert.ok(source.indexOf('id="methods"') < source.indexOf('id="works"'));
});
test('身份和方法在桌面双栏、移动端单栏', async () => {
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(css, /\.identity-index\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(css, /\.method-system__tracks\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(css, /@media \(max-width: 850px\)[\s\S]*?\.identity-index\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  assert.match(css, /@media \(max-width: 850px\)[\s\S]*?\.method-system__tracks\s*\{[^}]*grid-template-columns:\s*1fr;/s);
});

test('身份、方法与延伸阅读有清晰的键盘焦点', async () => {
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(css, /\.identity-index__english a:focus-visible\s*\{/);
  assert.match(css, /\.method-system__learning:focus-visible\s*\{/);
  assert.match(css, /\.method-track__row:focus-visible\s*\{/);
  assert.match(css, /\.method-track__related a:focus-visible\s*\{/);
  assert.match(css, /\.method-related a:focus-visible\s*\{/);
});

test('方法交互不使用卡片浮起或阴影，并尊重减少动态偏好', async () => {
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(css, /\.method-track__row\s*\{[^}]*min-height:\s*40px;/s);
  assert.match(css, /\.method-system__learning\s*\{[^}]*min-height:\s*40px;/s);
  assert.doesNotMatch(css, /\.method-(?:system__learning|track__row)(?::hover)?\s*\{[^}]*(?:box-shadow|translateY|scale\()/s);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.index-arrow\s*\{[^}]*transform:\s*none\s*!important;/s);
});

test('方法排版为中文引文、英文旁注和窄屏换行留出空间', async () => {
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(css, /\.identity-index blockquote p\s*\{[^}]*font-size:\s*clamp\(25px,/s);
  assert.match(css, /\.identity-index__english p\s*\{[^}]*font:\s*(?:normal\s+)?(?:1[0-5]|[1-9])px\//s);
  assert.match(css, /\.identity-index__english\s*\{[^}]*overflow-wrap:\s*anywhere;/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.method-track__row\s*\{[^}]*grid-template-columns:\s*34px\s+minmax\(0,\s*1fr\)\s+20px;/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.method-system__learning\s*\{[^}]*grid-template-columns:\s*34px\s+minmax\(0,\s*1fr\)\s+20px;/s);
});

test('390px 关键导航和文字链接保留触控高度', async () => {
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(
    css,
    /@media \(max-width: 560px\)[\s\S]*?\.brand,\s*\.site-footer a\s*\{[^}]*display:\s*inline-flex;[^}]*min-height:\s*44px;[^}]*align-items:\s*center;/s
  );
  assert.match(
    css,
    /@media \(max-width: 560px\)[\s\S]*?\.mobile-nav summary,\s*\.back-link,\s*\.text-link,\s*\.about-inline-links a,\s*\.not-found-links a\s*\{[^}]*display:\s*inline-flex;[^}]*min-height:\s*44px;[^}]*align-items:\s*center;/s
  );
  assert.match(
    css,
    /@media \(max-width: 560px\)[\s\S]*?\.mobile-nav nav a\s*\{[^}]*display:\s*flex;[^}]*min-height:\s*44px;[^}]*align-items:\s*center;/s
  );
});

test('390px 移动菜单在触控开关下方展开', async () => {
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(
    css,
    /@media \(max-width: 560px\)[\s\S]*?\.mobile-nav nav\s*\{[^}]*top:\s*100%;[^}]*margin-top:\s*4px;/s
  );
});

test('主导航标记当前页并提供可键盘使用的正文跳转', async () => {
  const header = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');

  assert.match(layout, /<a class="skip-link" href="#main-content">跳到主要内容<\/a>/);
  assert.match(header, /const \{ current \} = Astro\.props;/);
  assert.doesNotMatch(header, /current\s*=\s*'home'/);
  assert.match(header, /aria-current=\{current === 'home' \? 'page' : undefined\}/);
  assert.equal(
    header.match(/aria-current=\{current === item\.key \? 'page' : undefined\}/g)?.length,
    2
  );
  assert.match(header, /<span id="main-content" class="main-content-anchor" tabindex="-1"><\/span>/);
});

test('编辑式导航与细字元数据不再使用低对比旧色值', async () => {
  const globalCss = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  const editorialCss = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');

  assert.doesNotMatch(globalCss, /#078e7d|#087f71/i);
  assert.match(
    globalCss,
    /\.mobile-nav nav a\.active\s*\{[^}]*color:\s*var\(--editorial-accent,\s*#8b412d\);/s
  );
  assert.match(
    globalCss,
    /\.tool-proof__header > span,\s*\.tool-proof dt\s*\{[^}]*color:\s*var\(--editorial-accent,\s*#8b412d\);/s
  );
  assert.match(
    editorialCss,
    /\.skip-link\s*\{[^}]*min-height:\s*44px;[^}]*transform:\s*translateY\(-[^)]+\);/s
  );
  assert.match(
    editorialCss,
    /\.skip-link:focus-visible\s*\{[^}]*transform:\s*translateY\(0\);/s
  );
});

test('构建验证不再要求首页身份区块', async () => {
  const source = await readFile(new URL('../scripts/verify-build.mjs', import.meta.url), 'utf8');
  assert.match(source, /assert\.doesNotMatch\(index, \/长期主义者\|终身学习者\/\);/);
});