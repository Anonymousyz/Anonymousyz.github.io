import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const canonicalOrigin = 'https://decideandbuild.com';

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8');
}

test('站点以 decideandbuild.com 作为唯一公开域名', async () => {
  const [config, home, robots, sitemap, linkVerifier, buildVerifier, readme] = await Promise.all([
    source('astro.config.mjs'),
    source('src/pages/index.astro'),
    source('public/robots.txt'),
    source('public/sitemap.xml'),
    source('scripts/verify-links.mjs'),
    source('scripts/verify-build.mjs'),
    source('README.md')
  ]);

  assert.match(config, /site: 'https:\/\/decideandbuild\.com'/);
  assert.match(home, /url: 'https:\/\/decideandbuild\.com\/'/);
  assert.match(robots, /Sitemap: https:\/\/decideandbuild\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/decideandbuild\.com\/<\/loc>/);
  assert.match(linkVerifier, /const siteOrigin = 'https:\/\/decideandbuild\.com';/);
  assert.match(buildVerifier, /https:\/\/decideandbuild/);
  assert.match(readme, /Website: https:\/\/decideandbuild\.com/);

  for (const content of [config, home, robots, sitemap, linkVerifier, buildVerifier, readme]) {
    assert.doesNotMatch(content, /https:\/\/anonymousyz\.github\.io/);
  }
});

test('GitHub Pages 发布目录包含根域名 CNAME', async () => {
  const cname = await source('public/CNAME');
  assert.equal(cname.trim(), 'decideandbuild.com');
});
