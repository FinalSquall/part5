import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach } from 'vitest'

describe('<Blog />', () => {
  let container
  const mockLikeHandler = vi.fn()
  beforeEach(() => {
    const blog = {
      author: 'Jon W',
      title: 'An amazing piece',
      likes: 1,
      url: 'someb@test.com'
    }
    container = render(<Blog blog={blog} handleAddLike={mockLikeHandler} />).container
  })

  test ('by default renders title and author but not URL or likes', () => {
    const authorElement = screen.getByText('Jon W')
    const titleElement = screen.getByText('An amazing piece')

    const elementWithLikesAndUrl = container.querySelector('.blogDetails')

    expect(authorElement).toBeDefined()
    expect(titleElement).toBeDefined()

    expect(elementWithLikesAndUrl).toHaveStyle('display: none')

  })

  test ('when view details button is clicked, likes and url are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('when like button is pressed multiple times, event handler is called that number of times', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Like')
    await user.click(button)
    await user.click(button)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
