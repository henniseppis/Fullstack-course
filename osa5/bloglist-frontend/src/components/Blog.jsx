const Blog = ({ blog }) => (
  <div className="blog">
    <h3 className="blog_title">{blog.title}</h3>
    <p>
      <span className="blog_author">{blog.author}</span>{'  '}
    </p>
    <p><span className="blog_url">{blog.url}</span></p>
    <span className="blog_author">likes: {blog.likes}</span>
  </div>
);
export default Blog;