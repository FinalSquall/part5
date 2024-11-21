import { useState } from 'react'

const AddBlogForm = ({ handleSaveBlog }) => {
  const addFormStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }

  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')

  const buildBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title,
      author,
      url
    }
    await handleSaveBlog(blog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form style={addFormStyle} onSubmit={buildBlog}>
      <div>
          Title
        <input
          data-testid='title'
          type="text"
          value={title}
          name="title"
          placeholder='blog title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
          Author
        <input
          data-testid='author'
          type="text"
          value={author}
          name="author"
          placeholder='blog author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
          Url
        <input
          data-testid='url'
          type="text"
          value={url}
          name="Url"
          placeholder='blog url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button data-testid='blogSubmit' type="submit">Save</button>
    </form>
  )
}

export default AddBlogForm