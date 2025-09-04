import { defineConfig } from '@playwright/test'

// TODO: occurring problem on Github
export default defineConfig({
  testDir: './src/test',
  testMatch: /.*\.e2e-spec\.ts$/,
  timeout: 15 * 1000, // 15 segundos
  expect: {
    timeout: 10 * 1000, // 10 segundos
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:50789',
  },
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:50789',
    reuseExistingServer: !process.env.CI,
  },
})
