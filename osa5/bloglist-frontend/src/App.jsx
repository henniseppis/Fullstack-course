import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(false)

  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(false)
        setMessage(
          `a new blog called "${returnedBlog.title}" by ${returnedBlog.author} created successfully`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
  }

  const addLikes = id => {
    const blog = blogs.find(b => b.id === id)
    console.log(blog)
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        const together = { ...returnedBlog, user: blog.user }
        setBlogs(blogs.map(blog => blog.id !== id ? blog : together).sort((a, b) => b.likes - a.likes))
      })
  }

  const removeBlog = id => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {{
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setErrorMessage(false)
          setMessage(
            `${blog.title} deleted succesfully`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }}}

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage(true)
      setMessage(
        'wrong username or password'
      )
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} isError={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in
            <button onClick={logOut}>logout</button>
          </p>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} addlikes={addLikes} user={user} removeBlog={removeBlog} />
        )}
      </div>
    </div>
  )
}

export default App