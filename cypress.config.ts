import { defineConfig } from 'cypress';
import viteConfig from './vite.config.ts';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig,
    },
    supportFile: 'cypress/support/component.tsx',
    specPattern: 'cypress/component/**/*.cy.{ts,tsx}',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
});
