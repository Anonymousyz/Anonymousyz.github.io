import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import * as relationshipData from '../src/data/method-relationships.mjs';

const { methodRelationships } = relationshipData;

test('首页方法体系沿用两条主线和现有详情页链接', () => {
  assert.deepEqual(
    methodRelationships.paths.map(({ from, to, items }) => ({
      from,
      to,
      items: items.map(({ title, href }) => ({ title, href }))
    })),
    [
      {
        from: '分析',
        to: '决策',
        items: [
          { title: '研究', href: '/methods/research-and-judgment/' },
          { title: '多元思维', href: '/methods/plural-thinking/' },
          { title: '写作', href: '/methods/writing/' }
        ]
      },
      {
        from: '技术',
        to: '应用',
        items: [
          { title: '产品', href: '/methods/product-definition/' },
          { title: '视觉', href: '/methods/visual-information-design/' },
          { title: '工程', href: '/methods/product-and-engineering/' }
        ]
      }
    ]
  );
});

test('首页三条原则使用已确认的公开方法原文', () => {
  assert.deepEqual(relationshipData.homepagePrinciples, [
    {
      title: '先把要作的决定说清楚',
      description: '写清谁要作决定、决定什么、有哪些选择、何时决定，以及受到哪些限制。',
      href: '/methods/research-and-judgment/'
    },
    {
      title: '把事实、解释、评价和建议分开写',
      description: '事实与推理分开；建议写明谁来做、什么情况下做、适用于什么范围。',
      href: '/methods/writing/'
    },
    {
      title: '发布以后，问题仍要有人管',
      description: '交付时写明当前版本、已知限制、操作方法和负责人。',
      href: '/methods/product-and-engineering/'
    }
  ]);
});

test('首页先展示代表项目，再提供紧凑的方法入口', async () => {
  const source = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const methodSource = await readFile(new URL('../src/components/HomeMethodSystem.astro', import.meta.url), 'utf8');

  assert.match(source, /HomeMethodSystem/);
  assert.doesNotMatch(source, /HomeIdentityStrip|identityProfiles|id="identity"/);
  assert.doesNotMatch(source, /<MethodIndex/);
  assert.doesNotMatch(source, /<IdentityIndex/);
  assert.ok(source.indexOf('id="projects"') < source.indexOf('id="methods"'));
  assert.ok(source.indexOf('id="methods"') < source.indexOf('id="works"'));
  assert.doesNotMatch(methodSource, /home-principles/);
});

test('导航直接披露方法的七个方向', async () => {
  const source = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');

  for (const href of [
    '/methods/learning/',
    '/methods/research-and-judgment/',
    '/methods/plural-thinking/',
    '/methods/writing/',
    '/methods/product-definition/',
    '/methods/visual-information-design/',
    '/methods/product-and-engineering/',
  ]) {
    assert.match(source, new RegExp(href));
  }
  assert.match(source, /label: '方法'/);
  assert.match(source, /<a\s+class:list=\{\{ active: current === 'methods' \}\}\s+href=\{methodNav\.href\}/s);
  assert.doesNotMatch(source, /desktop-nav__methods|<summary>\{methodNav\.label\}/);
});

test('方法导航只把实际所在页面标为当前页', async () => {
  const source = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');

  assert.match(source, /const currentPath = Astro\.url\.pathname;/);
  assert.match(source, /const isMethodHub = currentPath === methodNav\.href;/);
  assert.match(source, /aria-current=\{isMethodHub \? 'page' : undefined\}/);
  assert.match(source, /aria-current=\{currentPath === item\.href \? 'page' : undefined\}/);
});

test('关于页保留身份引语，不再添加解释性说明', async () => {
  const source = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');

  assert.match(source, /<IdentityIndex identities=\{identityProfiles\}/);
  assert.doesNotMatch(source, /这些引语说明我认同的工作取向/);
});
