import { useState } from 'react'

const Blog = ({ blog, addlikes, user, removeBlog }) => {
  const [blogHidden, setBlogHidden] = useState(true)

  return (
    <div className="blog">
      <h3 className="blog_title">{blog.title}</h3>
      {blogHidden ? (
        <button onClick={() => setBlogHidden(false)}>view</button>
      ) : 
      (
        <div>
          <p><a href={blog.url} className="blog_url">{blog.url}</a></p>
          <span
            className="blog_author">likes: {blog.likes}{'  '}
            <button onClick={() => addlikes(blog.id)}>like</button>
          </span>
          <p><span className="blog_author">{blog.author}</span>{'  '}</p>
          <p><button onClick={() => setBlogHidden(true)}>hide</button></p>
          {blog.user?.username === user?.username && (
            <p>
              <button onClick={() => removeBlog(blog.id)}>remove</button>
            </p>
          )}
        </div>
      )}
    </div>
  )}
export default Blog