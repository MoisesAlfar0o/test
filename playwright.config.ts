import path from 'path';

import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

import 'dotenv/config';

// ⚠️ TEMPORAL (login manual) — ver auth/README.md
import { STORAGE_STATE } from './auth/storage-state';

const baseURL = process.env['NEXT_PUBLIC_INTERNAL_ZONE_HOST_URL'] ?? '';

const headless = !!process.env['CI'] || !!process.env['PLAYWRIGHT_HEADLESS'];

const outputDir = path.join(__dirname, 'test-results');

const DEFAULT_NAVIGATION_TIMEOUT = process.env['CI'] ? 30000 : 120000;
const DEFAULT_EXPECT_TIMEOUT = process.env['CI'] ? 30000 : 60000;
const DEFAULT_TEST_TIMEOUT = process.env['CI'] ? 60000 : 240000;

// bddgen convierte features/**/*.feature en tests de Playwright dentro de .features-gen/
const requestedFeature = process.env.QA_FRONT_FEATURE ?? '';
const bddFeatures = /^features(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)+\.feature$/.test(requestedFeature)
  ? requestedFeature
  : 'features/**/*.feature';

const bddTestDir = defineBddConfig({
  features: bddFeatures,
  steps: 'steps/**/*.ts',
  language: 'es',
});

const AUTHENTICATED_CHROMIUM = {
  ...devices['Desktop Chrome'],
  navigationTimeout: DEFAULT_NAVIGATION_TIMEOUT,
  storageState: STORAGE_STATE,
};

export default defineConfig({
  // Retry on CI only.
  retries: process.env['CI'] ? 2 : 0,

  // The maximum number of test failures for the whole test suite run.
  maxFailures: headless ? 10 : undefined,

  fullyParallel: true,

  // Opt out of parallel tests on CI.
  workers: process.env['CI'] ? 1 : undefined,

  // Timeout for each test, includes test, hooks and fixtures.
  timeout: DEFAULT_TEST_TIMEOUT,

  expect: { timeout: DEFAULT_EXPECT_TIMEOUT },

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env['CI'],

  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: './test-results/reports/playwright-html-report',
        open: 'never',
      },
    ],
    ['junit', { outputFile: './test-results/reports/results.xml' }],
    // El panel de qa-front lee este archivo para mostrar pasado y fallido.
    ['json', { outputFile: './test-results/reports/results.json' }],
  ],

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: path.join(outputDir, 'results'),

  use: {
    baseURL,
    headless,
    // Cámara lenta para ver la ejecución: PLAYWRIGHT_SLOW_MO=500 (milisegundos entre acciones)
    launchOptions: { slowMo: Number(process.env['PLAYWRIGHT_SLOW_MO'] ?? 0) },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // ⚠️ TEMPORAL (login manual) — ver auth/README.md
    // Valida que la sesión guardada con `pnpm auth:manual` siga vigente.
    {
      name: 'setup',
      testDir: './auth',
      testMatch: /auth\.setup\.ts/,
    },
    // ⚠️ TEMPORAL (login manual) — `pnpm auth:manual`: la persona inicia sesión en el navegador.
    {
      name: 'auth-manual',
      testDir: './auth',
      testMatch: /manual\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], headless: false },
    },
    // Pruebas BDD del BackOffice
    {
      name: 'bdd',
      testDir: bddTestDir,
      use: AUTHENTICATED_CHROMIUM,
      dependencies: ['setup'],
    },
    // Solo para los agentes de IA: deja el navegador autenticado en el BackOffice
    {
      name: 'seed',
      testDir: './seed',
      use: AUTHENTICATED_CHROMIUM,
      dependencies: ['setup'],
    },
  ],
});
