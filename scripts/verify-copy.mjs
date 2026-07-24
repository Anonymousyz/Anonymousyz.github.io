import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const visibleExtensions = new Set(['.astro', '.mjs']);
const prohibited = [
  /赋能/, /闭环/, /抓手/, /全方位/, /多维度/, /显著提升/,
  /充分(?:验证|体现)/, /能力矩阵/, /认知引擎/, /个人\s*OS/,
  /通过[^。！？\n]{0,36}(?:实现|进行|开展)/,
  /在[^。！？\n]{0,28}方面(?:进行|开展|作出)/,
];

async function collectVisibleSources(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'styles') files.push(...await collectVisibleSources(target));
      continue;
    }
    if (visibleExtensions.has(path.extname(entry.name))) files.push(target);
  }
  return files;
}

const files = await collectVisibleSources(root);
const hits = [];
for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const pattern of prohibited) {
    const match = source.match(pattern);
    if (match) hits.push(`${path.relative(root, file)}: ${match[0]}`);
  }
}

if (hits.length > 0) {
  console.error('中文写作护栏发现需要处理的表述：');
  for (const hit of hits) console.error(`- ${hit}`);
  process.exitCode = 1;
} else {
  console.log(`中文写作护栏通过：检查 ${files.length} 个可见文案源文件。`);
}
