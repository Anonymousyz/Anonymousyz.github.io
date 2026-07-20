# Method Page Title Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将方法页 H1 改为“判断与实现”，删除标题下的解释段，同时保持导航、方法索引和现有页面结构不变。

**Architecture:** 直接修改 Astro 方法总页模板，并用现有 Node 内容测试锁定标题、删除文案和元素顺序。随后运行站点完整检查，刷新已提交的 `docs/` 静态产物。

**Tech Stack:** Astro、Node.js `node:test`、静态 HTML 构建

## Global Constraints

- 顶部导航继续使用“方法”。
- 方法页眉题继续使用“研究、项目与公开作品中的做法”。
- 方法页 H1 使用“判断与实现”。
- 删除原解释段，不增加替代说明。
- 不修改首页“方法”栏目、七篇方法文章、项目案例、公开作品或视觉系统。
- 不执行 GitHub push 或发布。

---

### Task 1: 方法页标题与首屏收束

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `src/pages/methods/index.astro`
- Regenerate: `docs/methods/index.html`

**Interfaces:**
- Consumes: `MethodIndex` 组件与 `methodSystem.learning`、`methodSystem.tracks` 数据。
- Produces: `/methods/` 页面中的 H1“判断与实现”，标题后直接进入隐藏的“方法索引”H2。

- [ ] **Step 1: 先修改内容契约，使旧页面测试失败**

将现有标题顺序断言改为：

```js
  assert.match(hub, /<h1>判断与实现<\/h1>/);
  assert.doesNotMatch(hub, /这里记录我在研究、写作和系统建设中反复使用的做法/);
  assert.ok(hub.indexOf('<h1>判断与实现</h1>') < hub.indexOf('<h2 id="method-index-title"'));
```

- [ ] **Step 2: 运行目标测试并确认失败**

Run: `node --test --test-name-pattern="首页和方法总页复用同一套方法索引" tests/portfolio-content.test.mjs`

Expected: FAIL，指出方法页仍包含 `<h1>方法</h1>`，尚未出现“判断与实现”。

- [ ] **Step 3: 修改 Astro 页面**

将方法页 hero 改为：

```astro
    <section class="editorial-hero article-shell method-hub-hero">
      <p class="editorial-eyebrow">研究、项目与公开作品中的做法</p>
      <h1>判断与实现</h1>
    </section>
```

保留后续 `method-index-title`、`MethodIndex` 和“内容边界”区块不变。

- [ ] **Step 4: 运行目标测试并确认通过**

Run: `node --test --test-name-pattern="首页和方法总页复用同一套方法索引" tests/portfolio-content.test.mjs`

Expected: 目标测试 PASS。

- [ ] **Step 5: 运行完整质量门禁并刷新静态产物**

Run: `npm.cmd run check`

Expected: 全部 Node 测试通过；Astro 构建 15 个页面；`verify:build` 与 `verify:links` 通过。

- [ ] **Step 6: 检查构建结果与 diff**

Run: `rg -n "判断与实现|这里记录我在研究、写作和系统建设中反复使用的做法" src/pages/methods/index.astro docs/methods/index.html`

Expected: 源码和构建产物包含“判断与实现”，不包含被删除的说明句。

Run: `git diff --check`

Expected: 退出码 0，无空白错误。

- [ ] **Step 7: 浏览器检查**

在 `/methods/` 检查默认桌面视口与 390×844：H1 显示“判断与实现”，说明段已删除，方法索引紧随标题区，横向溢出为 0。

- [ ] **Step 8: 提交实现**

```bash
git add tests/portfolio-content.test.mjs src/pages/methods/index.astro docs/methods/index.html
git commit -m "refactor: sharpen method page heading"
```
