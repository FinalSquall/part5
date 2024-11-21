import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach } from 'vitest'
import AddBlog from './AddBlog'

describe('<AddBlog> ', () => {
  test('form calls event handler with correct props', async () => {
    const handleSaveBlog = vi.fn()
    const user = userEvent.setup()

    render(<AddBlog handleSaveBlog={handleSaveBlog} />)

    const titleInput = screen.getByPlaceholderText('blog title')
    const authorInput = screen.getByPlaceholderText('blog author')
    const urlInput = screen.getByPlaceholderText('blog url')
    const saveBtn = screen.getByText('Save')

    await user.type(titleInput,'Some blog title')
    await user.type(authorInput,'Coolio')
    await user.type(urlInput, 'coolio.auth')

    await user.click(saveBtn)

    console.log('mock_data',handleSaveBlog.mock.calls)
    console.log('test1',handleSaveBlog.mock.calls[0])
    console.log('test2',handleSaveBlog.mock.calls[0][0])
    expect(handleSaveBlog.mock.calls).toHaveLength(1)
    expect(handleSaveBlog.mock.calls[0][0].title).toBe('Some blog title')
    expect(handleSaveBlog.mock.calls[0][0].author).toBe('Coolio')
    expect(handleSaveBlog.mock.calls[0][0].url).toBe('coolio.auth')

  })
})