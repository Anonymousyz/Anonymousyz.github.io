# 个人主页方法体系重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development`（推荐）或 `executing-plans` 逐项实施本计划。所有步骤使用复选框跟踪；每完成一个任务，先验证，再提交。

**Goal:** 在不扩写三个项目案例的前提下，把首页重构为“首屏—身份—方法—项目—公开作品”，建立一个方法总页和七个可阅读的方法子页，让“从分析到决策 / 从技术到应用”成为清晰、并重且有证据连接的两条主线。

**Architecture:** 以 `src/data/methods.mjs` 作为身份、方法目录、文章内容和延伸证据的唯一数据源；首页与 `/methods/` 共用一个方法索引组件，七篇文章继续由 `src/pages/methods/[slug].astro` 静态生成。`docs/` 只存放 Astro 构建产物，设计、计划和验证报告均保存在 `specs/`。

**Tech Stack:** Astro 7、ES modules、原生 Node.js Test Runner、静态 HTML、CSS。

## Global Constraints

- 实施前阅读并遵守 `specs/2026-07-20-portfolio-method-system-redesign-design.md`；如本计划与设计稿冲突，以设计稿为准。
- 保留主标题原文：“从分析到决策 / 从技术到应用”。
- 保留“一个长案例、两个 Demo”和三个公开作品，本轮不扩写案例正文。
- 不新增 FDE 求职页、LinkedIn、未经证实的结果、客户背书、专业背书或验收结论。
- 不使用“个人 OS、能力矩阵、认知引擎、赋能、闭环、形成完整体系、证明能力、接受公开检查”等包装性表述。
- 保留当前未提交的 LinkedIn 删除：`src/pages/index.astro`、`src/pages/about.astro`、`src/components/SiteFooter.astro` 和相应测试。
- 不修改或暂存当前五个未跟踪组件：`DeliveryRail.astro`、`EvidenceBadge.astro`、`ProjectCard.astro`、`ProjectRow.astro`、`WorkLoop.astro`。
- 不手工编辑 `docs/**/*.html`；只通过 `npm run build` 重建。
- 不改写 Git 历史，不 push，不发布。
- 每次提交使用显式文件列表，提交前执行 `git diff --check` 和对应测试。

## Target File Map

| 文件 | 处理 | 职责 |
|---|---|---|
| `src/data/methods.mjs` | 重构 | 身份、七个方法、双主线、文章和延伸证据的唯一数据源 |
| `src/components/IdentityIndex.astro` | 新增 | 两栏身份与中英文引文 |
| `src/components/MethodIndex.astro` | 重构 | 通栏“持续学习”＋双栏方法索引；首页和总页复用 |
| `src/components/MethodArticle.astro` | 调整 | 返回方法总页、显示所属主线和相关文章 |
| `src/pages/index.astro` | 调整 | 新首页顺序、身份区、方法区、SEO 和结构化数据 |
| `src/pages/methods/index.astro` | 新增 | 方法总页 |
| `src/pages/methods/[slug].astro` | 保留路由并调整 | 由七篇文章生成静态页面 |
| `src/components/SiteHeader.astro` | 调整 | “方法”指向 `/methods/` |
| `src/styles/editorial.css` | 扩展 | A2 身份层级、M1 双栏、方法总页、响应式和可访问状态 |
| `src/data/portfolio.mjs` | 调整 | 更新已确认的首屏事实说明 |
| `tests/portfolio-content.test.mjs` | 重构 | 数据、文案边界、结构、路由与 LinkedIn 回归测试 |
| `scripts/verify-build.mjs` | 调整 | 从 11 个构建目标扩展到 15 个 |
| `scripts/verify-links.mjs` | 新增 | 静态内部链接、锚点和外部仓库链接格式检查 |
| `package.json` | 调整 | 把链接检查加入 `npm run check` |
| `public/sitemap.xml` | 调整 | 方法总页和七个方法页 |
| `specs/2026-07-20-portfolio-method-system-redesign-verification.md` | 新增 | 桌面、平板、手机、键盘、控制台和文案审查记录 |
| `docs/**` | 构建更新 | GitHub Pages 静态产物，不手改 |

---

## Task 1: 建立身份与方法目录的单一数据模型

**Files:**

- Modify: `tests/portfolio-content.test.mjs`
- Modify: `src/data/methods.mjs`

- [ ] **Step 1: 先增加身份与目录契约测试**

在测试文件的导入中加入 `identityProfiles`、`methodSystem`，并新增以下断言：

```js
import {
  identityProfiles,
  methodBySlug,
  methodArticles,
  methodSystem,
  methodTopics
} from '../src/data/methods.mjs';

test('身份只保留两个确认定义和可核对引文', () => {
  assert.deepEqual(identityProfiles.map((item) => item.title), [
    '长期主义者',
    '终身学习者'
  ]);
  assert.equal(identityProfiles[0].quote, '无欲速，无见小利。欲速则不达，见小利则大事不成。');
  assert.match(identityProfiles[0].englishAttribution, /Jeff Bezos.*1997 Letter to Shareholders/);
  assert.equal(identityProfiles[1].quote, '学不可以已。');
  assert.match(identityProfiles[1].englishAttribution, /Whole Earth Catalog.*Steve Jobs.*2005/);
  for (const item of identityProfiles) assert.match(item.sourceUrl, /^https:\/\//);
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
```

- [ ] **Step 2: 运行测试，确认因缺少导出而失败**

Run: `npm.cmd test -- --test-name-pattern="身份只保留|方法目录由"`

Expected: FAIL，错误明确指向 `identityProfiles` 或 `methodSystem` 尚未导出。

- [ ] **Step 3: 在 `methods.mjs` 顶部实现完整目录接口**

使用以下数据形状；七个入口的标题、摘要和路径必须保持原样：

```js
export const identityProfiles = [
  {
    key: 'long-termist',
    title: '长期主义者',
    quote: '无欲速，无见小利。欲速则不达，见小利则大事不成。',
    attribution: '孔子《论语·子路》',
    englishQuote: "It's All About the Long Term.",
    englishAttribution: 'Jeff Bezos，1997 Letter to Shareholders',
    sourceUrl: 'https://ir.aboutamazon.com/files/doc_financials/annual/2002_shareholderLetter.pdf'
  },
  {
    key: 'lifelong-learner',
    title: '终身学习者',
    quote: '学不可以已。',
    attribution: '荀子《劝学》',
    englishQuote: 'Stay hungry. Stay foolish.',
    englishAttribution: 'Whole Earth Catalog，Steve Jobs 2005 年斯坦福演讲引述',
    sourceUrl: 'https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish'
  }
];

export const methodSystem = {
  learning: {
    index: '00',
    track: 'learning',
    slug: 'learning',
    title: '持续学习',
    summary: '遇到不熟悉的问题，先找可靠资料，再放进实际工作里检验。',
    href: '/methods/learning/'
  },
  tracks: [
    {
      key: 'analysis-to-decision',
      label: '主线一',
      title: '从分析到决策',
      methods: [
        {
          index: '01',
          track: 'analysis-to-decision',
          slug: 'research-and-judgment',
          title: '研究与证据',
          summary: '先弄清谁要做什么决定，再确定查什么、查到哪一步。',
          href: '/methods/research-and-judgment/'
        },
        {
          index: '02',
          track: 'analysis-to-decision',
          slug: 'plural-thinking',
          title: '多元思维',
          summary: '换一种解释、一个模型或一个专业视角，检查原来的判断。',
          href: '/methods/plural-thinking/'
        },
        {
          index: '03',
          track: 'analysis-to-decision',
          slug: 'writing',
          title: '写作与表达',
          summary: '把结论、依据和需要谁做什么写清楚。',
          href: '/methods/writing/'
        }
      ],
      related: [
        { label: '工业绿色微电网评价软件', href: '/projects/#industrial-energy-carbon-system' },
        { label: 'Research-to-Decision Toolkit', href: 'https://github.com/Anonymousyz/research-to-decision-toolkit', external: true }
      ]
    },
    {
      key: 'technology-to-application',
      label: '主线二',
      title: '从技术到应用',
      methods: [
        {
          index: '04',
          track: 'technology-to-application',
          slug: 'product-definition',
          title: '产品定义',
          summary: '从使用者、场景和流程开始定义产品。',
          href: '/methods/product-definition/'
        },
        {
          index: '05',
          track: 'technology-to-application',
          slug: 'visual-information-design',
          title: '视觉与信息设计',
          summary: '用层级、排版和状态帮助人更快看懂、做对。',
          href: '/methods/visual-information-design/'
        },
        {
          index: '06',
          track: 'technology-to-application',
          slug: 'product-and-engineering',
          title: '工程与交付',
          summary: '把规则做进数据、权限和测试，直到系统可以交付。',
          href: '/methods/product-and-engineering/'
        }
      ],
      related: [
        { label: '总体所技改平台项目', href: '/projects/#industrial-digital-public-service-platform' },
        { label: 'AI Prototype-to-Production Toolkit', href: 'https://github.com/Anonymousyz/ai-prototype-to-production-toolkit', external: true }
      ]
    }
  ]
};

const allMethodTopics = [
  methodSystem.learning,
  ...methodSystem.tracks.flatMap((track) => track.methods)
];

export const methodBySlug = Object.fromEntries(
  allMethodTopics.map((item) => [item.slug, item])
);
```

为保持本任务提交时首页仍按旧结构运行，暂时让 `methodTopics` 从新目录派生旧的四项，不复制对象：

```js
export const methodTopics = [
  methodBySlug['research-and-judgment'],
  methodBySlug.writing,
  methodBySlug.learning,
  methodBySlug['product-and-engineering']
];
```

- [ ] **Step 4: 运行目标测试和全量测试**

Run: `npm.cmd test -- --test-name-pattern="身份只保留|方法目录由"`

Expected: 2 PASS。

Run: `npm.cmd test`

Expected: 31 PASS，0 FAIL。

- [ ] **Step 5: 检查并提交数据契约**

Run: `git diff --check`

Run: `git add src/data/methods.mjs tests/portfolio-content.test.mjs`

Run: `git commit -m "feat: define portfolio identity and method system"`

Expected: 只提交上述两个文件；五个未跟踪组件仍保持未暂存。

---

## Task 2: 重写持续学习与“从分析到决策”四篇文章

**Files:**

- Modify: `tests/portfolio-content.test.mjs`
- Modify: `src/data/methods.mjs`

- [ ] **Step 1: 把文章测试从旧四篇改为可逐步扩展的路由契约**

先加入以下公共派生值：

```js
const expectedMethodSlugs = [
  methodSystem.learning.slug,
  ...methodSystem.tracks.flatMap((track) => track.methods.map((item) => item.slug))
];
```

将旧的“四个方法页”测试改为：每篇文章必须复用目录中的 `title`、`summary`、`href`、`track`，并检查本任务完成后的五个页面：

```js
test('学习与分析主线文章使用目录中的同一份元数据', () => {
  const expected = [
    'learning',
    'research-and-judgment',
    'plural-thinking',
    'writing',
    'product-and-engineering'
  ];
  assert.deepEqual(methodArticles.map((article) => article.slug), expected);
  for (const article of methodArticles) {
    assert.equal(article.title, methodBySlug[article.slug].title);
    assert.equal(article.track, methodBySlug[article.slug].track);
    assert.ok(article.lead.length >= 36);
    assert.ok(article.sections.length >= 5);
  }
});
```

- [ ] **Step 2: 运行目标测试，确认旧文章顺序和标题导致失败**

Run: `npm.cmd test -- --test-name-pattern="学习与分析主线文章"`

Expected: FAIL，显示缺少 `plural-thinking` 或标题仍为“研究与判断 / 写作 / 学习”。

- [ ] **Step 3: 用元数据合并助手消除标题和路径重复**

在文章数组前增加：

```js
function article(slug, content) {
  const topic = methodBySlug[slug];
  if (!topic) throw new Error(`Unknown method slug: ${slug}`);
  const trackTitle = topic.track === 'learning'
    ? '持续学习'
    : methodSystem.tracks.find((track) => track.key === topic.track).title;
  return { ...topic, trackTitle, ...content };
}
```

所有文章改为 `article('slug', { lead, sections, related })`，不再手写 `index/title/href/track`。

- [ ] **Step 4: 重写“持续学习”**

使用六个自然标题，按这个顺序写完正文：

1. `先把眼前的问题弄明白`：说明如何用真实任务限定学习范围；
2. `先看原始材料`：权威资料、原始标准和来源时间；
3. `讲得清，也要做得出来`：用写作、讨论、公式、数据或实现暴露误解；
4. `项目会留下什么`：术语、来源、易错点、已验证例子；
5. `带到下一项工作`：复用记录，同时重查已经变化的标准和工具；
6. `后来改掉的习惯`：从“先收集完整课程”改为“围绕任务补足所需知识”。

正文必须出现“原始来源、实际工作、讲清楚、做出来、重新核对”等具体动作；不得出现“进入陌生领域、认知升级、学习闭环、学习迁移、赋能”。

- [ ] **Step 5: 重写“研究与证据”**

正文覆盖：谁要做什么决定；事实、解释、评价、建议四分；时间、定义、口径和来源立场；未知项和补证据动作；微电网标准进入指标、数据和计算规则；专业复核与工程测试边界。最后一个标题使用 `给判断留下改正的余地`，不使用“复盘与更新”。

- [ ] **Step 6: 新写“多元思维”**

至少六节，标题建议使用：

1. `先看问题，不先找模型`
2. `再找一种说得通的解释`
3. `借谁的眼睛来看`
4. `重要判断要留下推理`
5. `用反方问题找盲区`
6. `专业判断仍由专业人员复核`

必须明确：“专家委员会”在这里是人物视角和提问机制，不代表任何真实专家为作者或项目背书。不得罗列模型名词，不得把多元思维写成“认知模型库”。

- [ ] **Step 7: 重写“写作与表达”**

正文覆盖：探索性写作与结论性写作；读者、用途和待决定事项；事实、解释、评价、建议四分；行动主体、条件、边界；误读发生时先改标题和结构。保留总体所项目中任务、预算和交付物口径一致的例子。

- [ ] **Step 8: 增加文案边界测试**

```js
test('学习和分析主线不使用包装性术语', () => {
  const text = JSON.stringify(methodArticles.filter((item) =>
    ['learning', 'analysis-to-decision'].includes(item.track)
  ));
  assert.doesNotMatch(text, /进入陌生领域|认知升级|学习闭环|学习迁移|认知模型库|专业背书|赋能/);
  assert.match(text, /事实/);
  assert.match(text, /解释/);
  assert.match(text, /评价/);
  assert.match(text, /建议/);
});
```

- [ ] **Step 9: 测试、审读并提交**

Run: `npm.cmd test`

Expected: 全量 PASS。

人工审读：连续三个抽象名词必须拆开；每节至少出现一个具体人物、动作或对象；删除“不是……而是……”“真正的……”等解释腔。

Run: `git diff --check`

Run: `git add src/data/methods.mjs tests/portfolio-content.test.mjs`

Run: `git commit -m "feat: rewrite learning and decision methods"`

---

## Task 3: 补齐“从技术到应用”三篇文章

**Files:**

- Modify: `tests/portfolio-content.test.mjs`
- Modify: `src/data/methods.mjs`

- [ ] **Step 1: 先把文章路由契约提升为七篇**

```js
test('七个方法入口都有完整文章', () => {
  assert.deepEqual(methodArticles.map((article) => article.slug), expectedMethodSlugs);
  for (const article of methodArticles) {
    assert.equal(article.title, methodBySlug[article.slug].title);
    assert.equal(article.href, methodBySlug[article.slug].href);
    assert.ok(article.lead.length >= 36);
    assert.ok(article.sections.length >= 5);
    assert.ok(article.related.length >= 2);
  }
});
```

- [ ] **Step 2: 运行测试，确认缺少两个页面**

Run: `npm.cmd test -- --test-name-pattern="七个方法入口"`

Expected: FAIL，差异包含 `product-definition` 和 `visual-information-design`。

- [ ] **Step 3: 新写“产品定义”**

使用六节：`从谁遇到了什么问题开始`、`把角色和流程画清楚`、`看真实行为和付出`、`先验证一个关键假设`、`范围和停止条件`、`从功能清单改到问题定义`。正文必须覆盖现有替代方案、异常路径、MVP、指标和停止条件；不得把产品定义简化成“列需求”。

- [ ] **Step 4: 新写“视觉与信息设计”**

使用六节：`先看页面要完成什么`、`安排焦点和阅读顺序`、`让规则保持一致`、`不同载体有不同读法`、`检查状态和可访问性`、`从真实误读中改设计`。必须明确覆盖 Word、PPT、数据表格、网页和软件界面；具体写到颜色、字体、间距、组件、对比度、移动端和状态完整性；不得使用“审美升级、视觉赋能、设计语言闭环”。

- [ ] **Step 5: 把旧“产品与工程”改为“工程与交付”**

正文覆盖：业务规则进入数据、状态、权限和校验；项目约束下选择架构；核心流程、异常输入、权限和恢复路径；测试、构建检查和发布门禁；监控、回滚、数据和维护边界；内部功能版本、正式 UAT、预生产、生产验收四种状态。保留总体所和口腔项目链接，不把未完成阶段写成已通过。

- [ ] **Step 6: 增加应用主线的边界测试**

```js
test('技术到应用覆盖产品、视觉和交付边界', () => {
  const product = methodArticles.find((item) => item.slug === 'product-definition');
  const visual = methodArticles.find((item) => item.slug === 'visual-information-design');
  const engineering = methodArticles.find((item) => item.slug === 'product-and-engineering');
  assert.match(JSON.stringify(product), /使用者|场景|替代方案/);
  assert.match(JSON.stringify(product), /MVP|停止条件/);
  assert.match(JSON.stringify(visual), /Word|PPT|数据表格|网页|软件界面/);
  assert.match(JSON.stringify(visual), /对比度|移动端|可访问性/);
  assert.match(JSON.stringify(engineering), /数据|状态|权限|校验/);
  assert.match(JSON.stringify(engineering), /正式 UAT、预生产和生产验收尚未完成/);
  assert.doesNotMatch(JSON.stringify([product, visual, engineering]), /审美升级|视觉赋能|闭环/);
});
```

- [ ] **Step 7: 测试并提交**

Run: `npm.cmd test`

Expected: 全量 PASS，文章数量为 7。

Run: `git diff --check`

Run: `git add src/data/methods.mjs tests/portfolio-content.test.mjs`

Run: `git commit -m "feat: add product visual and delivery methods"`

---

## Task 4: 把两个身份放到首屏之后

**Files:**

- Create: `src/components/IdentityIndex.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/data/portfolio.mjs`
- Modify: `src/styles/editorial.css`
- Modify: `tests/portfolio-content.test.mjs`

- [ ] **Step 1: 先增加首页顺序和身份语义测试**

```js
test('首页在首屏之后展示两个身份', async () => {
  const source = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const identity = await readFile(new URL('../src/components/IdentityIndex.astro', import.meta.url), 'utf8');
  assert.match(source, /IdentityIndex/);
  assert.ok(source.indexOf('editorial-hero') < source.indexOf('id="identity"'));
  assert.ok(source.indexOf('id="identity"') < source.indexOf('id="methods"'));
  assert.match(identity, /blockquote/);
  assert.match(identity, /lang="en"/);
  assert.match(identity, /target="_blank"/);
  assert.match(identity, /rel="noreferrer"/);
});
```

- [ ] **Step 2: 运行测试，确认组件缺失**

Run: `npm.cmd test -- --test-name-pattern="首页在首屏之后"`

Expected: FAIL，`IdentityIndex.astro` 不存在。

- [ ] **Step 3: 创建无自证文案的身份组件**

```astro
---
const { identities } = Astro.props;
---

<div class="identity-index">
  {identities.map((identity) => (
    <article class="identity-index__item">
      <h3>{identity.title}</h3>
      <blockquote>
        <p>{identity.quote}</p>
        <cite>——{identity.attribution}</cite>
      </blockquote>
      <div class="identity-index__english" lang="en">
        <p>{identity.englishQuote}</p>
        <cite>
          <a href={identity.sourceUrl} target="_blank" rel="noreferrer">
            {identity.englishAttribution}<span aria-hidden="true"> ↗</span>
          </a>
        </cite>
      </div>
    </article>
  ))}
</div>
```

- [ ] **Step 4: 更新首页首屏和结构**

导入 `IdentityIndex` 和 `identityProfiles`；眉题改为“个人方法与项目实践”。在 `src/data/portfolio.mjs` 将 `heroCopy` 改为：

```js
export const heroCopy = '过去八年，我做过产业研究、政策分析和重大项目，也参与产品与软件系统建设。这里收录我使用的方法、公开作品和项目记录。';
```

首页继续从集中数据渲染 `<p class="editorial-lead">{heroCopy}</p>`，不在页面重复这段文字。

在首屏与方法之间加入：

```astro
<section class="editorial-section shell identity-section" id="identity" aria-labelledby="identity-title">
  <div class="editorial-section__head editorial-section__head--compact">
    <h2 id="identity-title">身份</h2>
  </div>
  <IdentityIndex identities={identityProfiles} />
</section>
```

不要为两个身份增加“为什么我有资格这样定义自己”的解释段落。

- [ ] **Step 5: 添加 A2 视觉基础样式**

```css
.editorial-section__head--compact { grid-template-columns: 1fr; }
.identity-index {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--editorial-rule);
}
.identity-index__item { padding: 30px 40px 34px 0; }
.identity-index__item + .identity-index__item {
  padding-left: 40px;
  border-left: 1px solid var(--editorial-soft);
}
.identity-index h3 { margin: 0 0 28px; font-size: 24px; font-weight: 500; }
.identity-index blockquote { margin: 0; }
.identity-index blockquote p { margin: 0; font-size: clamp(25px, 2.5vw, 35px); line-height: 1.55; }
.identity-index cite { display: block; margin-top: 14px; color: var(--editorial-muted); font: normal 13px/1.7 var(--editorial-sans); }
.identity-index__english { margin-top: 30px; color: var(--editorial-muted); }
.identity-index__english p { margin: 0; font: 15px/1.7 var(--editorial-serif); }
.identity-index__english a { text-underline-offset: 4px; }
```

在 `@media (max-width: 850px)` 中改为单栏，并保持“长期主义者→终身学习者”的 DOM 顺序。

- [ ] **Step 6: 测试并提交**

Run: `npm.cmd test`

Expected: 全量 PASS。

Run: `git diff --check`

Run: `git add src/components/IdentityIndex.astro src/pages/index.astro src/data/portfolio.mjs src/styles/editorial.css tests/portfolio-content.test.mjs`

Run: `git commit -m "feat: add identity section to portfolio home"`

注意：`src/pages/index.astro` 已有 LinkedIn 结构化数据删除，必须随文件保留，不能恢复。

---

## Task 5: 实现 M1 方法索引、方法总页与导航

**Files:**

- Modify: `src/components/MethodIndex.astro`
- Modify: `src/components/MethodArticle.astro`
- Create: `src/pages/methods/index.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/styles/editorial.css`
- Modify: `tests/portfolio-content.test.mjs`

- [ ] **Step 1: 先写复用与导航测试**

```js
test('首页和方法总页复用同一套方法索引', async () => {
  const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const hub = await readFile(new URL('../src/pages/methods/index.astro', import.meta.url), 'utf8');
  const header = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');
  assert.match(home, /MethodIndex/);
  assert.match(home, /methodSystem\.learning/);
  assert.match(home, /methodSystem\.tracks/);
  assert.match(hub, /MethodIndex/);
  assert.match(hub, /showRelated/);
  assert.match(header, /href: '\/methods\/'/);
  assert.doesNotMatch(header, /href: '\/methods\/research-and-judgment\/'/);
});
```

- [ ] **Step 2: 运行测试，确认方法总页缺失**

Run: `npm.cmd test -- --test-name-pattern="首页和方法总页"`

Expected: FAIL，`src/pages/methods/index.astro` 不存在。

- [ ] **Step 3: 重构 `MethodIndex.astro` 的唯一接口**

组件只接受三个 props：

```astro
---
const { learning, tracks, showRelated = false } = Astro.props;
---
```

DOM 顺序必须是：通栏学习入口、分析主线、应用主线。主体结构：

```astro
<div class="method-system">
  <a class="method-system__learning" href={learning.href}>
    <span class="index-number">{learning.index}</span>
    <strong>{learning.title}</strong>
    <p>{learning.summary}</p>
    <span class="index-arrow" aria-hidden="true">→</span>
  </a>
  <div class="method-system__tracks">
    {tracks.map((track) => (
      <section class="method-track" aria-labelledby={`track-${track.key}`}>
        <header>
          <span>{track.label}</span>
          <h3 id={`track-${track.key}`}>{track.title}</h3>
        </header>
        <div class="method-track__list">
          {track.methods.map((method) => (
            <a class="method-track__row" href={method.href}>
              <span class="index-number">{method.index}</span>
              <strong>{method.title}</strong>
              <p>{method.summary}</p>
              <span class="index-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
        {showRelated && (
          <div class="method-track__related" aria-label={`${track.title}延伸阅读`}>
            {track.related.map((item) => (
              <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
                {item.label}<span aria-hidden="true">{item.external ? ' ↗' : ' →'}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    ))}
  </div>
</div>
```

- [ ] **Step 4: 首页改用新接口并删除旧兼容导出**

首页调用：

```astro
<MethodIndex learning={methodSystem.learning} tracks={methodSystem.tracks} />
```

方法区标题保留“方法”，说明改为：

> 七个入口，记录我在研究、写作和系统建设中的具体做法。

删除首页对 `methodTopics` 的导入；随后从 `methods.mjs` 删除 Task 1 的临时 `methodTopics` 兼容导出，并同步删除旧测试依赖。

- [ ] **Step 5: 新增方法总页**

```astro
---
import Layout from '../../layouts/Layout.astro';
import MethodIndex from '../../components/MethodIndex.astro';
import SiteFooter from '../../components/SiteFooter.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import { methodSystem } from '../../data/methods.mjs';
---

<Layout
  title="方法｜Anonymousyz"
  description="从研究与证据到工程与交付：我在研究、项目和公开工具中使用的方法。"
>
  <SiteHeader current="methods" />
  <main>
    <section class="editorial-hero article-shell method-hub-hero">
      <p class="editorial-eyebrow">研究、项目与公开作品中的做法</p>
      <h1>方法</h1>
      <p class="editorial-lead">这里记录我在研究、写作和系统建设中反复使用的做法。新的材料和项目结果，也会改变其中的判断和次序。</p>
    </section>
    <section class="editorial-section article-shell method-hub" aria-label="方法索引">
      <MethodIndex learning={methodSystem.learning} tracks={methodSystem.tracks} showRelated />
    </section>
    <section class="editorial-section article-shell method-boundary">
      <h2>内容边界</h2>
      <p>这里记录的是我目前采用的做法。涉及专业结论时，由相应专业人员复核；项目状态仍以项目页列出的公开范围为准。</p>
    </section>
  </main>
  <SiteFooter />
</Layout>
```

- [ ] **Step 6: 更新导航与文章返回路径**

`SiteHeader.astro` 中“方法”改为 `/methods/`；`MethodArticle.astro` 的返回链接改为 `← 返回方法`、`href="/methods/"`，眉题直接使用数据中的 `article.trackTitle`，不在组件中重复主线映射。

- [ ] **Step 7: 加入 M1 结构样式**

实现 `.method-system__learning` 通栏、`.method-system__tracks` 两列、`.method-track__row` 纵向索引和 `.method-track__related` 延伸阅读。沿用细线、留白、编号和文字，不增加卡片背景、圆角卡片或阴影。桌面两列等宽；`max-width: 850px` 改为单列，DOM 顺序自然满足移动端要求。

- [ ] **Step 8: 测试并提交**

Run: `npm.cmd test`

Expected: 全量 PASS。

Run: `git diff --check`

Run: `git add src/components/MethodIndex.astro src/components/MethodArticle.astro src/pages/methods/index.astro src/pages/index.astro src/components/SiteHeader.astro src/styles/editorial.css src/data/methods.mjs tests/portfolio-content.test.mjs`

Run: `git commit -m "feat: add shared method hub and two-track index"`

---

## Task 6: 完成视觉、响应式与可访问状态

**Files:**

- Modify: `src/styles/editorial.css`
- Modify: `tests/portfolio-content.test.mjs`

- [ ] **Step 1: 增加关键视觉结构测试**

```js
test('身份和方法在桌面双栏、移动端单栏', async () => {
  const css = await readFile(new URL('../src/styles/editorial.css', import.meta.url), 'utf8');
  assert.match(css, /\.identity-index\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(css, /\.method-system__tracks\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(css, /@media \(max-width: 850px\)[\s\S]*?\.identity-index\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  assert.match(css, /@media \(max-width: 850px\)[\s\S]*?\.method-system__tracks\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  assert.match(css, /\.method-track__row:focus-visible/);
});
```

- [ ] **Step 2: 运行测试，确认焦点和响应式规则不完整**

Run: `npm.cmd test -- --test-name-pattern="身份和方法在桌面"`

Expected: FAIL，至少缺少 `.method-track__row:focus-visible` 或移动端规则。

- [ ] **Step 3: 完成桌面层级**

检查并调整以下关系：

- 身份中文引文是区内最大文字，英文不超过 15px、使用 muted 色；
- “持续学习”横跨全宽，视觉重量低于两条主线标题、高于单个方法条目；
- 两条主线宽度、标题字号、分隔线和上下留白完全一致；
- 索引行只允许文字颜色和箭头轻移，不做整体浮起；
- 方法总页的延伸阅读与方法条目分层，不抢主线标题。

- [ ] **Step 4: 完成 850px 与 560px 响应式**

保证 390px 下：外框不溢出；长英文出处可换行；方法摘要不挤压编号；所有链接的可点击高度不小于约 40px；顺序为首屏、两个身份、持续学习、分析主线、应用主线、项目、公开作品。

- [ ] **Step 5: 完成可访问状态**

为身份出处、通栏入口、方法行和延伸阅读提供可见 `:focus-visible`；hover 不能是唯一状态；在 `prefers-reduced-motion` 下取消箭头位移；标题层级保持 H1→H2→H3；外链保留 `target` 与 `rel`。

- [ ] **Step 6: 测试并提交**

Run: `npm.cmd test`

Expected: 全量 PASS。

Run: `git diff --check`

Run: `git add src/styles/editorial.css tests/portfolio-content.test.mjs`

Run: `git commit -m "style: polish portfolio method hierarchy"`

---

## Task 7: 扩展 sitemap、构建断言与链接检查

**Files:**

- Modify: `public/sitemap.xml`
- Modify: `scripts/verify-build.mjs`
- Create: `scripts/verify-links.mjs`
- Modify: `package.json`
- Modify: `tests/portfolio-content.test.mjs`

- [ ] **Step 1: 先把 sitemap 测试提升到八个方法 URL**

```js
test('sitemap 收录方法总页和七个方法页', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  for (const pathname of [
    '/methods/',
    ...expectedMethodSlugs.map((slug) => `/methods/${slug}/`)
  ]) {
    assert.match(sitemap, new RegExp(`<loc>https://anonymousyz\\.github\\.io${pathname}</loc>`));
  }
});
```

- [ ] **Step 2: 运行测试，确认缺少四个 URL**

Run: `npm.cmd test -- --test-name-pattern="sitemap 收录方法总页"`

Expected: FAIL，缺少 `/methods/`、`plural-thinking`、`product-definition`、`visual-information-design`。

- [ ] **Step 3: 更新 sitemap**

增加上述四个 `<url>`，方法总页 priority `0.9`，七个子页 priority `0.8`，全部 monthly。保留现有首页、项目、作品、关于和案例 URL。

- [ ] **Step 4: 将构建验证路由扩展到 15 项**

`scripts/verify-build.mjs` 的 `routes` 必须包含：

```js
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
```

同步把旧文案断言更新为七个新标题和新的首屏眉题；保留禁用词、私有路径、LinkedIn 和验收边界扫描。

- [ ] **Step 5: 新增静态链接检查器**

`scripts/verify-links.mjs` 完成以下确定性检查：

1. 递归读取 `docs/**/*.html`；
2. 提取 `href`；忽略 `mailto:`、`tel:`、`javascript:`；
3. 将站内 `/path/` 映射到 `docs/path/index.html`；
4. 对 `#anchor` 检查目标 HTML 中的同名 `id`；
5. 对 GitHub 外链只允许 `https://github.com/Anonymousyz/` 下的路径；
6. 对身份引用只允许设计稿确认的 Amazon 与 Stanford URL；
7. 发现坏链时输出来源文件、原 href 和解析目标，并以非零码退出；
8. 成功时输出 `Verified internal links, anchors, and approved external URLs.`。

不得在测试中请求真实外网，避免网络波动造成假失败；外部 URL 的真实打开留到浏览器验收。

- [ ] **Step 6: 加入 npm 脚本**

```json
"verify:links": "node scripts/verify-links.mjs",
"check": "npm test && npm run build && npm run verify:build && npm run verify:links"
```

- [ ] **Step 7: 完整构建验证并提交**

Run: `npm.cmd run check`

Expected:

- Node tests 全部 PASS；
- Astro build 成功；
- `Verified 15 routes ...`；
- `Verified internal links, anchors, and approved external URLs.`。

Run: `git diff --check`

Run: `git add public/sitemap.xml scripts/verify-build.mjs scripts/verify-links.mjs package.json tests/portfolio-content.test.mjs`

Run: `git commit -m "test: verify expanded portfolio method routes"`

---

## Task 8: 浏览器验收、文案复审、构建产物与最终提交

**Files:**

- Create: `specs/2026-07-20-portfolio-method-system-redesign-verification.md`
- Modify: `docs/**`（仅由构建生成）
- Include existing intended changes: `src/pages/about.astro`, `src/components/SiteFooter.astro`, `src/pages/index.astro`, `tests/portfolio-content.test.mjs`

- [ ] **Step 1: 重新生成干净构建**

Run: `npm.cmd run check`

Expected: 全链路 PASS；`docs/` 包含 15 个目标路由。

- [ ] **Step 2: 启动本地预览**

Run: `npm.cmd run dev -- --host 127.0.0.1 --port 4326`

Expected: Astro 输出 `http://127.0.0.1:4326/`，无构建错误。若 4326 被占用，先确认占用进程属于本项目，再选择一个空闲端口，并在验证报告记录实际端口。

- [ ] **Step 3: 使用浏览器完成三个视口检查**

逐一检查 1440×900、768×1024、390×844：

- 首页首屏、身份、方法、项目、公开作品顺序；
- 两个身份在桌面等宽、移动端按确认顺序堆叠；
- 中文引文强于英文旁注；
- 持续学习通栏、两条主线并重；
- 无卡片墙、无过度动效、无横向滚动；
- 方法总页和七篇文章均可打开；
- 项目和公开作品没有被本轮误改。

- [ ] **Step 4: 完成键盘、链接和控制台检查**

仅用 Tab/Shift+Tab 遍历导航、身份出处、七个方法入口、项目和公开作品；焦点必须可见且顺序与 DOM 一致。点击 Amazon、Stanford 和至少三个 GitHub 仓库链接，确认 URL 正确；查看浏览器控制台，记录错误为 0。

- [ ] **Step 5: 做最后一次中文文案与逻辑审查**

逐段检查首页、方法总页和七个子页：

- 删除“不是……而是……”“真正的……”“这套方法……”的机械句式；
- 删除连续三个以上的抽象名词；
- 事实、解释、评价、建议不混写；
- “专家委员会”不暗示真实专家背书；
- 工程页不把内部功能版本写成 UAT、预生产或生产验收；
- 每篇至少连接一个项目和一个公开作品；
- 标题与摘要在首页、总页和子页完全一致。

如发现问题，先加回归测试，再改文案或样式，重新运行 `npm.cmd run check`。

- [ ] **Step 6: 写验证报告**

报告至少包含：

```md
# 个人主页方法体系重构验证

- 日期：2026-07-20
- 分支：codex/portfolio-redesign-20260719
- 本地地址：实际预览地址
- GitHub 推送：未执行
- 发布：未执行

## 自动检查
- npm.cmd test：通过，实际测试数
- npm.cmd run build：通过
- npm.cmd run verify:build：通过，15 routes
- npm.cmd run verify:links：通过

## 浏览器检查
| 视口 | 首页 | 方法总页 | 七个子页 | 横向溢出 | 控制台 |
|---|---|---|---|---|---|
| 1440×900 | 通过/问题 | 通过/问题 | 通过/问题 | 无/有 | 0/实际数 |
| 768×1024 | 通过/问题 | 通过/问题 | 通过/问题 | 无/有 | 0/实际数 |
| 390×844 | 通过/问题 | 通过/问题 | 通过/问题 | 无/有 | 0/实际数 |

## 文案与边界
- AI 腔复审：结论与改动
- 专业背书边界：结论
- 项目验收边界：结论
- LinkedIn 扫描：0 处

## 未包含
- 案例扩写
- Git 历史改写
- GitHub push
- 网站发布
```

不得用“通过”代替未实际执行的检查。

- [ ] **Step 7: 检查最终暂存范围**

Run: `git status --short`

Run: `git diff --name-only`

确认五个未跟踪组件仍未暂存；确认 `.env*`、密钥、数据库、私人路径未进入差异。

- [ ] **Step 8: 提交 LinkedIn 删除、构建产物和验证记录**

先用显式列表暂存既有 LinkedIn 删除：

Run: `git add src/pages/about.astro src/components/SiteFooter.astro src/pages/index.astro tests/portfolio-content.test.mjs`

再暂存构建产物和验证报告：

Run: `git add docs specs/2026-07-20-portfolio-method-system-redesign-verification.md`

Run: `git diff --cached --check`

Run: `git diff --cached --name-status`

Expected: 不包含五个未跟踪组件，不包含任何密钥或私有数据。

Run: `git commit -m "feat: complete portfolio method system redesign"`

- [ ] **Step 9: 提交后复验**

Run: `npm.cmd run check`

Run: `git status --short --branch`

Expected: 自动检查仍全通过；工作区只剩实施前就存在且明确不纳入的五个未跟踪组件。不要执行 `git push`。

---

## Final Self-Review Contract

实施者交付前必须逐项回答：

- [ ] 首屏眉题是否已改成“个人方法与项目实践”？
- [ ] “从分析到决策 / 从技术到应用”是否原文保留且视觉并重？
- [ ] 身份是否只有两个定义、四条引文和准确出处，没有自证段落？
- [ ] 首页是否先身份、后方法，且信息量没有重新膨胀？
- [ ] 首页与方法总页是否使用同一份数据和同一个索引组件？
- [ ] 七个入口是否都有实际路由、完整文章、项目或公开作品链接？
- [ ] 多元思维是否说明“专家委员会”的真实边界？
- [ ] 视觉与信息设计是否覆盖多种载体，而非只写网页审美？
- [ ] 工程与交付是否清楚区分内部版本、UAT、预生产和生产验收？
- [ ] 15 个构建目标、sitemap、内部链接、锚点和外链格式是否通过检查？
- [ ] 1440、768、390 三个视口、键盘焦点和控制台是否有实际记录？
- [ ] LinkedIn 是否在源码、结构化数据和构建产物中均为 0？
- [ ] 五个既有未跟踪组件是否没有被修改或提交？
- [ ] 最终是否只完成本地提交，没有 push、发布或改写历史？
