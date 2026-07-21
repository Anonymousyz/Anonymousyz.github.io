import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { identityProfiles } from '../src/data/methods.mjs';
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
      title: '从决策问题开始',
      description: '先写清决策主体、待决定事项、可选动作、时间窗口和约束条件。',
      href: '/methods/research-and-judgment/'
    },
    {
      title: '分开事实、解释、评价和建议',
      description: '事实与推理分开，建议写清行动主体、触发条件和适用边界。',
      href: '/methods/writing/'
    },
    {
      title: '发布以后仍有工程责任',
      description: '交付时说明当前版本、已知限制、操作方式和责任人。',
      href: '/methods/product-and-engineering/'
    }
  ]);
});

test('首页身份简注使用第一人称确认稿', () => {
  assert.deepEqual(identityProfiles.map(({ title, homeNote }) => ({ title, homeNote })), [
    {
      title: '长期主义者',
      homeNote: '我愿意把时间放在能够积累、反复使用并接受结果检验的事情上。'
    },
    {
      title: '终身学习者',
      homeNote: '我对陌生领域保持兴趣，也会根据新材料和实际结果修正自己的理解。'
    }
  ]);
});

test('首页先展示代表项目，再提供紧凑的方法入口', async () => {
  const source = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const methodSource = await readFile(new URL('../src/components/HomeMethodSystem.astro', import.meta.url), 'utf8');

  assert.match(source, /HomeMethodSystem/);
  assert.match(source, /HomeIdentityStrip/);
  assert.doesNotMatch(source, /<MethodIndex/);
  assert.doesNotMatch(source, /<IdentityIndex/);
  assert.ok(source.indexOf('id="projects"') < source.indexOf('id="methods"'));
  assert.ok(source.indexOf('id="methods"') < source.indexOf('id="works"'));
  assert.ok(source.indexOf('id="works"') < source.indexOf('id="identity"'));
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
  assert.match(source, /<summary>\{methodNav\.label\}<span aria-hidden="true">⌄<\/span><\/summary>/);
});

test('方法导航只把实际所在页面标为当前页', async () => {
  const source = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');

  assert.match(source, /const currentPath = Astro\.url\.pathname;/);
  assert.match(source, /const isMethodHub = currentPath === methodNav\.href;/);
  assert.match(source, /aria-current=\{isMethodHub \? 'page' : undefined\}/);
  assert.match(source, /aria-current=\{currentPath === item\.href \? 'page' : undefined\}/);
});

test('关于页承接完整身份引语并说明证据边界', async () => {
  const source = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');

  assert.match(source, /<IdentityIndex identities=\{identityProfiles\}/);
  assert.match(
    source,
    /这些引语说明我认同的工作取向。项目、作品和长期结果才是能力证据。/
  );
});
