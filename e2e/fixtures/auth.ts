import { test as base, type Page } from '@playwright/test'
import {
  createTestUser,
  cleanupTestUser,
  injectAuthSession,
  extractUserId,
} from '../helpers/auth-utils'

// --- Playwright custom fixture ---

type AuthFixtures = {
  testUserId: string
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  testUserId: async ({}, use) => {
    const testUser = await createTestUser()
    await use(testUser.userId)
    await cleanupTestUser(testUser.userId)
  },

  authenticatedPage: async ({ browser }, use) => {
    const testUser = await createTestUser()
    const context = await browser.newContext()
    await injectAuthSession(context, testUser.email)
    const page = await context.newPage()
    await use(page)
    await context.close()
    await cleanupTestUser(testUser.userId)
  },
})

export { expect } from '@playwright/test'
export { createTestUser, cleanupTestUser, injectAuthSession, extractUserId } from '../helpers/auth-utils'
