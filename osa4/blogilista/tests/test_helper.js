const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Leipiä",
        author: "Rolle Ruokanen",
        url: "kolmosweepisteruokapistecom",
        likes: 5,
        id: "67fe01732a2b8d7867be9686"
    },
    {
        title: "Kakkuja",
        author: "Rolle Ruokanen",
        url: "kolmosweepisteruokapistecom",
        likes: 8,
        id: "67fccbb59e3bf885ad709c1c"
    },
]



const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}