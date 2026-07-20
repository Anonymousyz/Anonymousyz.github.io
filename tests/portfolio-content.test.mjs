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

test('方法目录由持续学习和两条并重主线组成', () => {
  assert.equal(methodSystem.learning.title, '持续学习');
  assert.deepEqual(methodSystem.tracks.map((track) => track.title), [
    '从分析到决策',
    '从技术到应用'
  ]);
  assert.deepEqual(methodSystem.tracks[0].methods.map((item) => item.title), [
    '研究与证据',
    '多元思维',
    '写作与表达'
  ]);
  assert.deepEqual(methodSystem.tracks[1].methods.map((item) => item.title), [
    '产品定义',
    '视觉与信息设计',
    '工程与交付'
  ]);
  assert.equal(methodSystem.tracks[0].methods.length, methodSystem.tracks[1].methods.length);
});

test('首页和方法总页复用同一套方法索引', async () => {
  const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const hub = await readFile(new URL('../src/pages/methods/index.astro', import.meta.url), 'utf8');
  const header = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');
  const index = await readFile(new URL('../src/components/MethodIndex.astro', import.meta.url), 'utf8');
  const article = await readFile(new URL('../src/components/MethodArticle.astro', import.meta.url), 'utf8');
  const data = await readFile(new URL('../src/data/methods.mjs', import.meta.url), 'utf8');

  assert.match(home, /MethodIndex/);
  assert.match(home, /methodSystem\.learning/);
  assert.match(home, /methodSystem\.tracks/);
  assert.match(hub, /MethodIndex/);
  assert.match(hub, /showRelated/);
  assert.match(hub, /aria-labelledby="method-index-title"/);
  assert.match(hub, /<h2 id="method-index-title" class="visually-hidden">方法索引<\/h2>/);
  assert.match(hub, /<h1>判断与实现<\/h1>/);
  assert.doesNotMatch(hub, /这里记录我在研究、写作和系统建设中反复使用的做法/);
  assert.ok(hub.indexOf('<h1>判断与实现</h1>') < hub.indexOf('<h2 id="method-index-title"'));
  assert.ok(hub.indexOf('<h2 id="method-index-title"') < hub.indexOf('<MethodIndex'));
  assert.match(header, /href: '\/methods\/'/);
  assert.doesNotMatch(header, /href: '\/methods\/research-and-judgment\/'/);
  assert.match(index, /const \{ learning, tracks, showRelated = false \} = Astro\.props;/);
  assert.match(index, /method-system__learning/);
  assert.match(index, /method-system__tracks/);
  assert.ok(index.indexOf('method-system__learning') < index.indexOf('method-system__tracks'));
  assert.match(index, /target=\{item\.external \? '_blank' : undefined\}/);
  assert.match(index, /rel=\{item\.external \? 'noreferrer' : undefined\}/);
  assert.match(article, /href="\/methods\/"/);
  assert.match(article, /article\.trackTitle/);
  assert.doesNotMatch(data, /export const methodTopics/);
});

test('一级定位保持用户确认的原文', () => {
  assert.deepEqual(positioning, ['从分析到决策', '从技术到应用']);
});

test('首页事实说明保持确认稿', () => {
  assert.equal(
    heroCopy,
    '过去八年，我做过产业研究、政策分析和重大项目，也参与产品与软件系统建设。这里收录我使用的方法、公开作品和项目记录。'
  );
});

test('首页项目固定为一个主案例和两份项目记录', () => {
  assert.equal(featuredCase.title, '工业绿色微电网评价软件');
  assert.equal(featuredCase.href, '/projects/#industrial-energy-carbon-system');
  assert.deepEqual(demos.map((item) => item.title), [
    '总体所技改平台项目',
    '口腔小程序项目'
  ]);
  assert.deepEqual(demos.map((item) => item.href), [
    '/projects/#industrial-digital-public-service-platform',
    '/projects/#oral-care-mini-program'
  ]);
  assert.deepEqual(demos.map((item) => item.kind), ['内部功能版本', '受控 Demo']);

  const techReform = projects.find((item) => item.id === 'industrial-digital-public-service-platform');
  assert.match(techReform.summary, /项目方案、任务和预算.*台账、权限、状态和工作台/);
  assert.match(techReform.deliveryPath, /政策与产业问题.*项目方案与任务.*角色与对象.*审批流程.*权限、状态与工作台/);
  assert.match(techReform.results.join(''), /申报与论证材料.*内部功能版本/);
});

test('七个方法入口都有完整文章', () => {
  assert.deepEqual(methodArticles.map((article) => article.slug), expectedMethodSlugs);
  for (const article of methodArticles) {
    assert.equal(article.title, methodBySlug[article.slug].title);
    assert.equal(article.summary, methodBySlug[article.slug].summary);
    assert.equal(article.href, methodBySlug[article.slug].href);
    assert.equal(article.track, methodBySlug[article.slug].track);
    assert.ok(article.lead.length >= 36);
    assert.ok(article.sections.length >= 5);
    assert.ok(article.related.length >= 2);
  }
});

test('技术到应用覆盖产品、视觉和交付边界', () => {
  const product = methodArticles.find((item) => item.slug === 'product-definition');
  const visual = methodArticles.find((item) => item.slug === 'visual-information-design');
  const engineering = methodArticles.find((item) => item.slug === 'product-and-engineering');
  const productText = JSON.stringify(product);
  const visualText = JSON.stringify(visual);
  const engineeringText = JSON.stringify(engineering);

  for (const term of [
    '使用者', '场景', '替代方案', '角色', '对象', '流程',
    '异常', 'MVP', '指标', '范围', '停止条件'
  ]) {
    assert.match(productText, new RegExp(term));
  }

  for (const term of [
    'Word', 'PPT', '数据表格', '网页', '软件界面', '焦点',
    '层级', '阅读顺序', '颜色', '字体', '间距', '组件',
    '状态', '对比度', '移动端', '可访问性'
  ]) {
    assert.match(visualText, new RegExp(term));
  }

  for (const term of [
    '数据', '状态', '权限', '校验', '架构', '异常',
    '恢复', '测试', '构建', '发布', '监控', '回滚',
    '维护', '正式 UAT', '预生产', '生产验收'
  ]) {
    assert.match(engineeringText, new RegExp(term));
  }

  assert.match(engineeringText, /正式 UAT、预生产和生产验收尚未完成/);
  assert.doesNotMatch(JSON.stringify([product, visual, engineering]), /审美升级|视觉赋能|闭环/);

  for (const article of [product, visual, engineering]) {
    assert.ok(article.related.some((item) => item.href.startsWith('/projects/#')));
    assert.ok(article.related.some((item) => tools.some((tool) => tool.href === item.href)));
  }
});

test('视觉设计写明主页真实修订依据和确认结果', () => {
  const visual = methodArticles.find((item) => item.slug === 'visual-information-design');
  const text = JSON.stringify(visual);

  for (const excerpt of [
    '旧版个人主页把“研究、写作、学习、产品与工程”放在同一层',
    '读者能看见四个入口，却看不出持续学习与两条主线的关系',
    '这次改版把“持续学习”放在通栏位置',
    '其余六项归入两条主线',
    '桌面端和移动端保持相同的信息顺序',
    '主要链接也保留清晰的键盘焦点'
  ]) {
    assert.match(text, new RegExp(excerpt));
  }

  assert.doesNotMatch(text, /已完成视觉验收|通过视觉验收/);
});

test('视觉设计为移动端宽表提供具体规则', () => {
  const visual = methodArticles.find((item) => item.slug === 'visual-information-design');
  const text = JSON.stringify(visual);

  for (const rule of [
    '小屏先保留关键列',
    '无法压缩的表格允许横向滚动',
    '表头说明单位'
  ]) {
    assert.match(text, new RegExp(rule));
  }
});

test('文章元数据由目录覆盖正文同名字段', async () => {
  const source = await readFile(new URL('../src/data/methods.mjs', import.meta.url), 'utf8');
  assert.match(source, /return \{ \.\.\.content, \.\.\.topic, trackTitle \};/);
});

test('方法页使用复核后的文案、公开边界和现阶段链接', () => {
  const research = methodArticles.find((item) => item.slug === 'research-and-judgment');
  const product = methodArticles.find((item) => item.slug === 'product-and-engineering');
  const researchText = JSON.stringify(research);
  const productText = JSON.stringify(product);

  assert.match(researchText, /我先核对发布时间、定义、统计口径和作者立场，再判断差异来自哪里/);
  assert.doesNotMatch(researchText, /案例会把这几类检查分开写/);
  assert.match(researchText, /专业人员另行复核原始标准，真实环境验收也单独进行/);
  assert.match(productText, /正式 UAT、预生产和生产验收尚未完成/);
  assert.doesNotMatch(productText, /页面不会把这些阶段写成已经通过/);
  assert.equal(
    product.related.find((item) => item.label === '口腔小程序项目').href,
    '/projects/#oral-care-mini-program'
  );
});

test('学习页不使用抽象学习术语', () => {
  const learning = methodArticles.find((item) => item.slug === 'learning');
  const text = JSON.stringify(learning);
  assert.doesNotMatch(text, /进入陌生领域|认知更新|学习迁移|方法论闭环/);
  assert.match(text, /做不下去|讲不清楚|回头/);
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

test('复审文案使用明确人物和动作', () => {
  const learningText = JSON.stringify(methodArticles.find((item) => item.slug === 'learning'));
  const pluralText = JSON.stringify(methodArticles.find((item) => item.slug === 'plural-thinking'));
  const writingText = JSON.stringify(methodArticles.find((item) => item.slug === 'writing'));

  assert.match(learningText, /我根据当天要完成的规则，只补这一项计算所需的知识/);
  assert.doesNotMatch(learningText, /实际工作把学习范围压到/);
  assert.match(pluralText, /同事用反方问题指出未知项后，我/);
  assert.doesNotMatch(pluralText, /反方问题如果指出/);
  assert.equal(
    (pluralText.match(/需要专业结论时，再请相应人员复核/g) ?? []).length,
    1
  );
  assert.doesNotMatch(pluralText, /真实专家为作者或项目背书|提问角色当作署名者/);
  assert.match(writingText, /我在事项旁标注“待专业复核”/);
  assert.doesNotMatch(writingText, /不会把工作记录读成/);
  assert.match(writingText, /我在材料中写明项目边界，并留下后续可核对的依据/);
  assert.doesNotMatch(writingText, /材料保留项目边界/);
});

test('工作闭环按确认顺序提供具体动作', () => {
  assert.deepEqual(workLoop.map((item) => item.title), [
    '问题界定',
    '范围确定',
    '组织实现',
    '验证交付',
    '方法复用'
  ]);

  for (const item of workLoop) {
    assert.match(item.description, /。$/);
  }
});

test('代表项目顺序固定', () => {
  assert.deepEqual(projects.map((item) => item.title), [
    '工业绿色微电网评价软件',
    '总体所技改平台项目',
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
  assert.match(source, /交付路径/);
  assert.match(source, /可公开说明的范围/);
  assert.match(source, /暂无项目附件/);
  assert.doesNotMatch(source, /验证证据|可展示内容/);
});

test('口腔项目锚点与首页和方法页链接一致', () => {
  const oralProject = projects.find((item) => item.id === 'oral-care-mini-program');
  const oralDemo = demos.find((item) => item.title === '口腔小程序项目');
  const product = methodArticles.find((item) => item.slug === 'product-and-engineering');
  const oralRelated = product.related.find((item) => item.label === '口腔小程序项目');

  assert.ok(oralProject);
  assert.equal(oralDemo.href, `/projects/#${oralProject.id}`);
  assert.equal(oralRelated.href, `/projects/#${oralProject.id}`);
});

test('代表项目提供交付路径和公开说明范围', () => {
  for (const project of projects) {
    assert.ok(project.deliveryPath.length > 0);
    assert.ok(project.publicScope.length >= 3);
  }
});

test('证据状态只有三种', () => {
  assert.deepEqual(evidenceStates.map((item) => item.label), [
    '公开可复验',
    '真实项目，脱敏展示',
    '待外部验证'
  ]);
});

test('公开作品保留三个入口', () => {
  assert.equal(tools.length, 3);
  for (const tool of tools) {
    assert.match(tool.href, /^https:\/\/github\.com\/Anonymousyz\//);
  }
});

test('公开作品提供版本、检查路径和方法边界', () => {
  assert.deepEqual(tools.map((item) => item.version), ['v0.6.0', 'v0.6.0', '持续维护']);

  for (const tool of tools) {
    assert.ok(tool.runtime.length > 0);
    assert.ok(tool.quickStart.items.length > 0);
    assert.ok(tool.proofTypes.length >= 3);
    assert.ok(tool.methodBoundary.length > 0);
  }
});

test('首页公开作品摘要保持确认稿', () => {
  assert.deepEqual(tools.map((item) => item.homeSummary), [
    '从研究问题、证据整理到方案比较的一组模板。',
    '帮助团队检查 AI 原型能否进入真实业务流程。',
    '收录 AI 系统上线前需要检查的工程和治理资料。'
  ]);
});

test('首页按方法、项目和公开作品组织内容', async () => {
  const source = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(source, /MethodIndex/);
  assert.match(source, /ProjectIndex/);
  assert.match(source, /PublicWorkIndex/);
  assert.match(source, /heroCopy/);
  assert.match(source, /id="methods"/);
  assert.match(source, /一个主案例，两份脱敏项目记录/);
  assert.doesNotMatch(source, /一个完整案例/);
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
  assert.match(source, /研究材料怎样进入/);
  assert.match(source, /可以运行和检查的公开产物/);
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

test('关于页不重复主页主标题', async () => {
  const about = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(about, /从分析到决策|从技术到应用/);
  assert.match(about, />我通常接手的问题</);
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

test('集中内容不包含求职话术、私有路径或运行信息', async () => {
  const source = await readFile(new URL('../src/data/portfolio.mjs', import.meta.url), 'utf8');
  const forbidden = [
    /FDE\s*求职/i,
    /目标岗位/,
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

test('首页在首屏之后展示两个身份', async () => {
  const source = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const identity = await readFile(new URL('../src/components/IdentityIndex.astro', import.meta.url), 'utf8');
  assert.match(source, /<IdentityIndex identities=\{identityProfiles\} \/>/);
  assert.match(source, /<p class="editorial-eyebrow">个人方法与项目实践<\/p>/);
  assert.match(source, /<p class="editorial-lead">\{heroCopy\}<\/p>/);
  assert.ok(source.indexOf('editorial-hero') < source.indexOf('id="identity"'));
  assert.ok(source.indexOf('id="identity"') < source.indexOf('id="methods"'));
  assert.match(identity, /blockquote/);
  assert.match(identity, /lang="en"/);
  assert.match(identity, /target="_blank"/);
  assert.match(identity, /rel="noreferrer"/);
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
    /@media \(max-width: 560px\)[\s\S]*?\.brand,\s*\.site-footer a\s*\{[^}]*display:\s*inline-flex;[^}]*min-height:\s*40px;[^}]*align-items:\s*center;/s
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

test('七篇方法文章各自连接一个项目和一项具名 GitHub 作品', () => {
  assert.equal(methodArticles.length, 7);

  for (const article of methodArticles) {
    assert.ok(
      article.related.some((item) => item.href.startsWith('/projects/')),
      article.slug + ' missing project link'
    );
    assert.ok(
      article.related.some((item) => /^https:\/\/github\.com\/Anonymousyz\/.+/.test(item.href)),
      article.slug + ' missing GitHub work link'
    );
  }

  assert.deepEqual(
    methodArticles.find((item) => item.slug === 'learning').related,
    [
      { label: '工业绿色微电网评价软件', href: '/projects/#industrial-energy-carbon-system' },
      {
        label: 'Awesome AI Production Readiness',
        href: 'https://github.com/Anonymousyz/awesome-ai-production-readiness',
        external: true
      }
    ]
  );
  assert.deepEqual(
    methodArticles.find((item) => item.slug === 'plural-thinking').related,
    [
      { label: '工业绿色微电网评价软件', href: '/projects/#industrial-energy-carbon-system' },
      {
        label: 'Research-to-Decision Toolkit',
        href: 'https://github.com/Anonymousyz/research-to-decision-toolkit',
        external: true
      }
    ]
  );
  assert.deepEqual(
    methodArticles.find((item) => item.slug === 'writing').related,
    [
      { label: '总体所技改平台项目', href: '/projects/#industrial-digital-public-service-platform' },
      {
        label: 'Research-to-Decision Toolkit',
        href: 'https://github.com/Anonymousyz/research-to-decision-toolkit',
        external: true
      }
    ]
  );
});

test('最终文案使用确认后的具体表述和项目主线', async () => {
  const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const hub = await readFile(new URL('../src/pages/methods/index.astro', import.meta.url), 'utf8');
  const visual = methodArticles.find((item) => item.slug === 'visual-information-design');
  const plural = methodArticles.find((item) => item.slug === 'plural-thinking');
  const engineering = methodArticles.find((item) => item.slug === 'product-and-engineering');
  const microgrid = projects.find((item) => item.id === 'industrial-energy-carbon-system');
  const oral = projects.find((item) => item.id === 'oral-care-mini-program');

  assert.match(
    home,
    /description="围绕“从分析到决策、从技术到应用”整理的个人方法、公开作品和项目记录。"/
  );
  assert.match(hub, /<h1>判断与实现<\/h1>/);
  assert.doesNotMatch(hub, /我会根据新材料和项目结果，调整这些做法。/);
  assert.doesNotMatch(hub, /改变其中的判断和次序/);
  assert.equal(microgrid.pillar, '从分析到决策 · 从技术到应用');
  assert.equal(oral.pillar, '从技术到应用');
  assert.equal(
    visual.sections.at(-1).paragraphs.at(-1),
    '这次改版把“持续学习”放在通栏位置，其余六项归入两条主线。桌面端和移动端保持相同的信息顺序，主要链接也保留清晰的键盘焦点。'
  );
  assert.match(
    JSON.stringify(plural),
    /我把这种做法叫作“专家委员会”：分别从项目负责人、专业人员等角色出发列问题。需要专业结论时，再请相应人员复核。/
  );
  assert.equal(
    engineering.lead,
    '业务规则确认后，我把它们落实为数据、状态、权限和校验。技术方案按部署环境和维护条件取舍，交付前再检查异常处理、测试、部署和维护责任。'
  );
});
