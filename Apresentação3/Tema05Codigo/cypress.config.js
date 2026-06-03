import { defineConfig } from 'cypress';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    supportFile: resolve(__dirname, 'cypress/support/e2e.js'),
    specPattern: resolve(__dirname, 'cypress/e2e/**/*.cy.{js,jsx}'),
  },
  video: false,
  screenshotOnRunFailure: false,
});
