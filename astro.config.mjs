import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://decideandbuild.com',
  output: 'static',
  outDir: './docs',
  build: {
    assets: 'assets'
  }
});
