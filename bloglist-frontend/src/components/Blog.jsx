import { useState } from 'react'
import '../index.css'

const Blog = ({ loggedInUser, blog, handleAddLike, handleDeleteBlog }) => {
  const [view,setView] = useState(false)

  const showOnView = { display: view ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeStyle = {
    fontWeight: 600,
    fontSize: 20
  }

  const addLike = (event) => {
    console.log('like press')
    event.preventDefault()
    let likes = blog.likes + 1
    const updBlog = {
      ...blog,
      likes,
      user: {
        ...blog.user
      }
    }
    handleAddLike(updBlog)
    blog.likes = blog.likes + 1
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Deleting ${blog.title} by ${blog.author}. Are you Sure?`)) {
      handleDeleteBlog(blog.id)
    }
  }

  const showDetails = (event) => {
    event.preventDefault()
    console.log(blog)
    setView(!view)
  }

  return (
    <div style={blogStyle}>
      <div >
        <p>{blog.title}</p> <p>{blog.author}</p><button data-testid='view-detail' onClick={showDetails}>{!view ? 'View' : 'Cancel'}</button>
      </div>
      <div className="blogDetails" style={showOnView}>
        <p>{blog.url}</p>
        <p className="likes" style={likeStyle}>{blog.likes}<button className="button-71" role="button" onClick={addLike}>Like</button></p>
        {blog.user ? <p>{blog.user.name}</p> : <p></p>}
        {blog.user && blog.user.username === loggedInUser.username ? <button className="button-44" data-testid="blogdelbtn" role="button" onClick={deleteBlog}>Delete</button> : <></>}
      </div>
    </div>

  )
}

export default Blog