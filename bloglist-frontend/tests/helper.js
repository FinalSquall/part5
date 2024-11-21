const loginWith = async (page,username,password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('loginBtn').click()
}

const createBlog = async (page,title,author,url) => {
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByTestId('blogSubmit').click()
}

const addNewUser = async (username,name,password,request) => {
  await request.post('/api/users', {
    data: {
      username: username,
      name:name,
      password: password
    }
  })
}

export { loginWith, createBlog, addNewUser }