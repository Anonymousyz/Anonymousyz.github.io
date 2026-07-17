import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://anonymousyz.github.io',
  output: 'static',
  outDir: './docs',
  build: {
    assets: 'assets'
  }
});
