const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Hemppa',
        username: 'hennitestaa',
        password: 'enkerro'
      }
    })
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Blogs')
    await expect(locator).toBeVisible()
  })

  test('login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('user can log in sucesfully with correct credentials', async ({ page }) => {
      await loginWith(page, 'hennitestaa', 'enkerro')
      await expect(page.getByText('Hemppa logged in')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
      await loginWith(page, 'hennitestaa', 'vääräsalis')
          const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Hemppa logged in')).not.toBeVisible()

    })
  })
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'hennitestaa', 'enkerro')
    })

    test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'testiblogi', 'testaaja', 'www.testaajakäyttis.fi')
    await expect(page.getByRole('heading', { name: 'testiblogi' })).toBeVisible()
    })
  })
})  
