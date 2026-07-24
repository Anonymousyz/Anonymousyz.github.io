import assert from 'node:assert/strict';
import test from 'node:test';
import { access, readFile } from 'node:fs/promises';

import { projects } from '../src/data/portfolio.mjs';

test('工业技术改造项目只展示一张脱敏公共门户首页', async () => {
  const project = projects.find((item) => item.id === 'industrial-digital-public-service-platform');
  const pageSource = await readFile(new URL('../src/pages/projects.astro', import.meta.url), 'utf8');

  assert.equal(project.prototypeShowcase.images.length, 1);
  assert.equal(project.prototypeShowcase.images[0].src, '/images/projects/tech-reform-portal.png');
  assert.equal(project.prototypeShowcase.images[0].label, '公共门户首页');
  assert.match(project.prototypeShowcase.images[0].boundary, /不含真实组织、项目、账号或运行地址/);
  assert.doesNotMatch(pageSource, /featured-switcher/);
  assert.doesNotMatch(pageSource, /data-prototype-switcher/);
  await access(new URL('../public/images/projects/tech-reform-portal.png', import.meta.url));
});
