const { test, describe, expect, beforeEach, afterEach } = require('@playwright/test')
const { loginWith, createBlog, addNewUser } = require('./helper')

describe('Blog App', () => {
  beforeEach(async ({ page,request }) => {
    await page.goto('/')
    await request.post('/api/testing/reset')
    await addNewUser('hgranger','Hermione','smart',request)
    await addNewUser('hpotter','Harry Potter','chosen',request)
  })

  afterEach(async ( { page,request } ) => {
    await page.goto('/') //Needed to clear out database after each test for some cases where some data is left
    await request.post('/api/testing/reset')
  })

  test('Show login by default', async ({ page }) => {
    const loginbtn = await page.getByText('login')
    await expect(loginbtn).toBeVisible()

    const username = await page.getByText('username')
    await expect(username).toBeVisible()

    const pass = await page.getByText('password')
    await expect(pass).toBeVisible()
  })

  describe('Login Tests', () => {
    test('login succeeds with correct credential', async ( { page } ) => {
      await loginWith(page,'hgranger','smart')

      await expect(page.getByText('Hermione logged-in')).toBeVisible()
    })

    test('login fails with invalid credentials', async ( { page } ) => {
      await loginWith(page,'hgranger','badpass')
      const errorDiv = await page.locator('.notification')
      await expect(errorDiv).toContainText('Invalid Credential')
      await expect(page.getByText('Hermione logged-in')).not.toBeVisible()

    })
  })

  describe('Blog Tests', () => {
    test('logged in user can create a blog', async ( { page } ) => {
      await loginWith(page,'hgranger','smart')
      await page.getByText('New Blog').click()

      await expect(page.getByTestId('author')).toBeVisible()
      await expect(page.getByTestId('title')).toBeVisible()
      await expect(page.getByTestId('url')).toBeVisible()

      await createBlog(page, 'Some blog','Coolio','cc@test')
      await expect(page.getByText('Not Existing Blog')).not.toBeVisible()
      await expect(page.getByTestId('blogdiv').getByText('Some blog')).toBeVisible()
    })

    test('blog can be liked', async ( { page } ) => {
      await loginWith(page,'hgranger','smart')
      await page.getByText('New Blog').click()
      await createBlog(page, 'Some blog','Coolio','cc@test')
      await page.getByTestId('view-detail').click()
      const curBlog = await page.getByTestId('blogdiv').getByText('Some blog').locator('..').locator('..')
      await expect(curBlog.locator('.likes')).toBeVisible()
      await expect(curBlog.getByText('0')).toBeVisible()
      await curBlog.getByText('0').waitFor()
      await curBlog.getByRole('button', { name: 'Like' }).click()
      await expect(curBlog.getByText('1')).toBeVisible()
    })

    test('user that created blog can delete blog', async ( { page } ) => {
      await loginWith(page,'hgranger','smart')
      await page.getByText('New Blog').click()
      await createBlog(page, 'Some blog','Coolio','cc@test')
      await page.getByTestId('view-detail').click()
      await expect(page.getByText('Hermione logged-in')).toBeVisible()

      page.on('dialog',dialog => dialog.accept())
      await page.getByTestId('blogdelbtn').click()
      const curBlog = await page.getByTestId('blogdiv').getByText('Some blog')
      await expect(curBlog).not.toBeVisible()
      await expect(page.getByText('Hermione logged-in')).toBeVisible()
    })

    test('only the user that added a blog can delete it', async ( { page } ) => {
      await loginWith(page,'hgranger','smart')
      await page.getByText('New Blog').click()
      await createBlog(page, 'Some blog','Coolio','cc@test')
      await page.getByTestId('view-detail').click()
      await expect(page.getByText('Hermione logged-in')).toBeVisible()

      const curBlog = await page.getByTestId('blogdiv').getByText('Some blog')
      await expect(curBlog).toBeVisible()
      await expect(page.getByTestId('blogdelbtn')).toBeVisible()

      await page.getByTestId('logoutBtn').click()

      await loginWith(page,'hpotter','chosen')

      await page.getByTestId('view-detail').click()

      await expect(page.getByText('Harry Potter logged-in')).toBeVisible()

      await expect(page.getByTestId('blogdelbtn')).not.toBeVisible()

    })

    test('blogs are arranged in descending order of likes from top to bottom', async ( { page } ) => {
      await loginWith(page,'hgranger','smart')
      await page.getByText('New Blog').click()
      await createBlog(page, 'Some blog','Coolio','cc@test')
      await page.getByTestId('blogdiv').getByText('Some blog').waitFor()
      await createBlog(page, 'Another great blog','Stewie','sg@test')
      await page.getByTestId('blogdiv').getByText('Another great blog').waitFor()
      await createBlog(page, 'The complete show','Brian','bg@test')
      await page.getByTestId('blogdiv').getByText('The complete show').waitFor()

      const sbBlogRoot = await page.getByTestId('blogdiv').getByText('Some blog').locator('..').locator('..')
      const agbRoot = await page.getByTestId('blogdiv').getByText('Another great blog').locator('..').locator('..')
      const tcsRoot = await page.getByTestId('blogdiv').getByText('The complete show').locator('..').locator('..')

      await sbBlogRoot.getByTestId('view-detail').click()

      await expect(sbBlogRoot.locator('.likes')).toBeVisible()

      await agbRoot.getByTestId('view-detail').click()

      await expect(agbRoot.locator('.likes')).toBeVisible()

      await tcsRoot.getByTestId('view-detail').click()

      await expect(tcsRoot.locator('.likes')).toBeVisible()


      /*
            Verify blogs are in order that they were added initially (no like sorting)
          */
      const initBlogDetailsArr = await page.locator('.blogDetails').all()

      await expect(initBlogDetailsArr[0].getByText('cc@test')).toBeVisible()
      await expect(initBlogDetailsArr[0].getByText('0')).toBeVisible()
      await expect(initBlogDetailsArr[1].getByText('sg@test')).toBeVisible()
      await expect(initBlogDetailsArr[1].getByText('0')).toBeVisible()
      await expect(initBlogDetailsArr[2].getByText('bg@test')).toBeVisible()
      await expect(initBlogDetailsArr[2].getByText('0')).toBeVisible()

      await tcsRoot.getByRole('button', { name: 'Like' }).click({ clickCount:5 })

      await tcsRoot.getByText('5').waitFor()

      await sbBlogRoot.getByRole('button', { name: 'Like' }).click({ clickCount:3 })

      await sbBlogRoot.getByText('3').waitFor()

      await agbRoot.getByRole('button', { name: 'Like' }).click()

      await agbRoot.getByText('1').waitFor()

      await expect(agbRoot.getByText('1')).toBeVisible()
      await expect(sbBlogRoot.getByText('3')).toBeVisible()
      await expect(tcsRoot.getByText('5')).toBeVisible()
      const blogDetailsArr = await page.locator('.blogDetails').all()

      /*
            Verify that blogs are now in sorted order with 0th element having 5 likes and length-1 element having 1 like
          */

      await expect(blogDetailsArr[0].getByText('bg@test')).toBeVisible()
      await expect(blogDetailsArr[0].getByText('5')).toBeVisible()
      await expect(blogDetailsArr[1].getByText('cc@test')).toBeVisible()
      await expect(blogDetailsArr[1].getByText('3')).toBeVisible()
      await expect(blogDetailsArr[2].getByText('sg@test')).toBeVisible()
      await expect(blogDetailsArr[2].getByText('1')).toBeVisible()

    })
  })
})