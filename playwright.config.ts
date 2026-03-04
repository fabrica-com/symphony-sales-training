import { defineConfig } from '@playwright/test'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local for Supabase credentials
config({ path: resolve(__dirname, '.env.local') })

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
})
