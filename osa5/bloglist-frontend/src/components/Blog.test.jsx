import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kirsi Kirjailija',
    url: 'nettisivu'
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('Component testing is done with react-testing-library')
  expect(titleElement).toBeDefined()

  const authorElement = screen.queryByText('Kirsi Kirjailija')
  expect(authorElement).not.toBeInTheDocument()
  const urlElement = screen.queryByText('nettisivu')
  expect(urlElement).not.toBeInTheDocument()

})

test('author and url is shown when view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kirsi Kirjailija',
    url: 'nettisivu',
    likes: 6
  }
  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const titleElement = screen.getByText('Component testing is done with react-testing-library')
  expect(titleElement).toBeDefined()

  const authorElement = screen.getByText('Kirsi Kirjailija')
  expect(authorElement).toBeDefined()

  const urlElement = screen.getByText('nettisivu')
  expect(urlElement).toBeDefined()

  const likeElement = screen.getByText('likes: 6')
  expect(likeElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kirsi Kirjailija',
    url: 'nettisivu',
    likes: 6
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} addlikes={mockHandler} />
  )
  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})