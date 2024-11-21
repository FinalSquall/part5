import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import AddBlogForm from './components/AddBlog'
import Togglable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [info, setInfo] = useState({ message:null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedOnUserStr = window.localStorage.getItem('loggedBlogUser')
    if (loggedOnUserStr) {
      const loggedOnUser = JSON.parse(loggedOnUserStr)
      setUser(loggedOnUser)
    }
  },[])

  const notify = (exception, type='info') => {
    if (!exception.response.data) {
      notifyWith(exception.message,type)
    } else {
      notifyWith(exception.response.data.message,type)
    }
  }

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })
    console.log(message)
    console.log(type)
    console.log(info)

    setTimeout(() => {
      setInfo({ message: null } )
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      notifyWith('User login successful')
    } catch (exception) {
      notifyWith('Invalid Credentials','error')
    }
  }

  const handleSaveBlog = async (blog) => {
    try {
      const res = await blogService.create(blog,buildAuthHeader())
      setBlogs(blogs.concat(res).sort((a, b) => b.likes - a.likes))
      console.log('added blog')
      notifyWith(`Blog ${blog.title} by ${blog.author} successfully added`)
    } catch (exception) {
      notify(exception,'error')
    }
  }

  const handleAddLike = async (blog) => {
    console.log(blog)
    try {
      const res = await blogService.update(blog.id,blog,buildAuthHeader())
      res.user = blog.user //Feel like this may not have been the intended change for 5.9. But seems to work
      setBlogs(blogs.map(b => b.id === blog.id ? res : b).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      notify(exception,'error')
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      const res = await blogService.deleteBlog(id,buildAuthHeader())
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (exception) {
      console.log('ex',exception)
      notify(exception,'error')
    }
  }

  const buildAuthHeader = () => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    }
    return config
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogUser')
  }

  if (user === null) {
    return (
      <div>
        <Notification info={info}/>
        <form onSubmit={handleLogin}>
          <div>
          Username
            <input
              data-testid='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          Password
            <input
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button data-testid='loginBtn' type="submit">login</button>
        </form>
      </div>

    )
  } else {
    return (
      <div>
        <Notification info={info}/>
        <div>
          <p>{user.name} logged-in</p>
        </div>
        <form onSubmit={handleLogout}>
          <button data-testid="logoutBtn" type="submit">Logout</button>
        </form>
        <Togglable buttonLabel="New Blog">
          <AddBlogForm handleSaveBlog={handleSaveBlog} notify={notifyWith} />
        </Togglable>
        <div data-testid='blogdiv'>
          <h2>blogs</h2>
          { blogs.map(blog =>
            <Blog loggedInUser={user} handleDeleteBlog={handleDeleteBlog} handleAddLike={handleAddLike} key={blog.id} blog={blog} />
          )}
        </div>
      </div>

    )
  }
}

export default App