import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs');
const siteOrigin = 'https://decideandbuild.com';
const approvedIdentityUrls = new Set([
  'https://ir.aboutamazon.com/files/doc_financials/annual/2002_shareholderLetter.pdf',
  'https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish'
]);
const ignoredProtocols = new Set(['mailto:', 'tel:', 'javascript:']);
const htmlCache = new Map();
const errors = [];

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtml(full));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }

  return files;
}

function decodeHtml(value) {
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', quot: '"' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|quot);/gi, (match, entity) => {
    const normalized = entity.toLowerCase();
    if (normalized.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
    }
    if (normalized.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
    }
    return named[normalized] ?? match;
  });
}

function extractHrefs(html) {
  const hrefs = [];
  const pattern = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
  for (const match of html.matchAll(pattern)) {
    hrefs.push(decodeHtml(match[1] ?? match[2] ?? match[3] ?? ''));
  }
  return hrefs;
}

function sourceUrl(file) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const pathname = relative === 'index.html'
    ? '/'
    : relative.endsWith('/index.html')
      ? `/${relative.slice(0, -'index.html'.length)}`
      : `/${relative}`;
  return new URL(pathname, siteOrigin);
}

function safeDecode(value, label) {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new Error(`invalid URL encoding in ${label}`);
  }
}

function candidatesFor(url) {
  const pathname = safeDecode(url.pathname, 'path');
  const relative = pathname.replace(/^\/+/, '');

  if (pathname === '/') return [path.join(root, 'index.html')];
  if (pathname === '/404/') return [path.join(root, '404.html')];
  if (pathname.endsWith('/')) return [path.join(root, relative, 'index.html')];
  if (path.extname(relative)) return [path.join(root, relative)];
  return [
    path.join(root, relative, 'index.html'),
    path.join(root, `${relative}.html`),
    path.join(root, relative)
  ];
}

function staysInsideRoot(target) {
  const relative = path.relative(root, target);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function firstFile(candidates) {
  for (const candidate of candidates) {
    if (!staysInsideRoot(candidate)) continue;
    try {
      const details = await stat(candidate);
      if (details.isFile()) return candidate;
    } catch {
      // Try the next deterministic route form.
    }
  }
  return null;
}

async function idsFor(file) {
  if (!htmlCache.has(file)) {
    const html = await readFile(file, 'utf8');
    const ids = new Set();
    const pattern = /\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
    for (const match of html.matchAll(pattern)) {
      ids.add(decodeHtml(match[1] ?? match[2] ?? ''));
    }
    htmlCache.set(file, ids);
  }
  return htmlCache.get(file);
}

function describeTarget(target, anchor = '') {
  return `${target}${anchor ? `#${anchor}` : ''}`;
}

function report(source, href, target, reason) {
  errors.push(`${path.relative(root, source)}: href="${href}" -> ${target}: ${reason}`);
}

function approvedExternal(url) {
  if (url.protocol !== 'https:' || url.username || url.password) return false;
  if (url.hostname.toLowerCase() === 'github.com') {
    return url.pathname === '/Anonymousyz' || url.pathname.startsWith('/Anonymousyz/');
  }
  return approvedIdentityUrls.has(url.href);
}

async function verifyInternal(source, href, url) {
  let candidates;
  let anchor = '';
  try {
    candidates = candidatesFor(url);
    anchor = url.hash ? safeDecode(url.hash.slice(1), 'anchor') : '';
  } catch (error) {
    report(source, href, url.href, error.message);
    return;
  }

  const escapedTarget = candidates.find((candidate) => !staysInsideRoot(candidate));
  if (escapedTarget) {
    report(source, href, describeTarget(escapedTarget, anchor), 'target leaves docs root');
    return;
  }

  const target = await firstFile(candidates);
  const displayTarget = describeTarget(target ?? candidates[0], anchor);
  if (!target) {
    report(source, href, displayTarget, 'target does not exist');
    return;
  }

  if (!anchor) return;
  if (!target.endsWith('.html')) {
    report(source, href, displayTarget, 'anchor target is not an HTML file');
    return;
  }

  const ids = await idsFor(target);
  if (!ids.has(anchor)) report(source, href, displayTarget, `missing id="${anchor}"`);
}

const htmlFiles = await collectHtml(root);

for (const source of htmlFiles) {
  const html = await readFile(source, 'utf8');
  const base = sourceUrl(source);

  for (const href of extractHrefs(html)) {
    const trimmed = href.trim();
    if (!trimmed) continue;

    let url;
    try {
      url = new URL(trimmed, base);
    } catch {
      report(source, href, trimmed, 'invalid URL');
      continue;
    }

    if (ignoredProtocols.has(url.protocol.toLowerCase())) continue;
    if (url.origin === siteOrigin && !url.username && !url.password) {
      await verifyInternal(source, href, url);
      continue;
    }
    if (!approvedExternal(url)) {
      report(source, href, url.href, 'external URL is not approved');
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Verified internal links, anchors, and approved external URLs.');
}
