import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('构建验证检查新方法标题与无项目片段边界', async () => {
  const source = await readFile(
    new URL('../scripts/verify-build.mjs', import.meta.url),
    'utf8',
  );

  for (const title of [
    '研究｜决策问题 · 证据链 · 结论树',
    '多元思维｜规律 · 工具 · 视角',
    '写作｜判断 · 证据 · 表达',
    '产品｜做什么 · 为什么做 · 验证什么',
    '视觉｜功能 · 一致性 · 删除',
    '工程｜怎么做稳 · 怎么维护 · 怎么交付',
  ]) {
    assert.ok(source.includes(title), `构建验证缺少标题：${title}`);
  }

  assert.match(source, /<h1>工作方法<\\\/h1>/);
  assert.match(source, /工业绿色微电网\|工业技术改造投资管理平台项目\|口腔小程序/);
  assert.doesNotMatch(source, /正式 UAT、预生产和生产验收尚未完成/);
});

test('链接验证只增加 Gallup 官方 Learner 来源', async () => {
  const source = await readFile(
    new URL('../scripts/verify-links.mjs', import.meta.url),
    'utf8',
  );

  assert.match(
    source,
    /https:\/\/www\.gallup\.com\/cliftonstrengths\/en\/252293\/learner-theme\.aspx/,
  );
});
