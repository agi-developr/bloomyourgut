import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bloomyourgut.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'zh', 'de', 'fr', 'pt', 'ja', 'ko', 'ru', 'ar'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  build: {
    format: 'directory'
  }
});
