const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')


const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })


describe('viewing blogs', () => {
  test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)

    })

  test('the first blog is about bread', async () => {
      const response = await api.get('/api/blogs')

      const titles = response.body.map(e => e.title)
      assert.strictEqual(titles.includes('Leipiä'), true)
    })

  test("one blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
  
  test('id is named wihtout underline', async () => {

    const blogs = await helper.blogsInDb()

      blogs.forEach(blog => {
      assert.ok('id' in blog)
      })

  })
})

describe('adding blogs', () => {
  beforeEach(async () => {
    await User.deleteOne({ username: 'testihenni' })
    await api.post('/api/users').send({
      username: 'testihenni',
      name: 'testiH',
      password: 'salasana'
    }).expect(201)

    const loginRes = await api.post('/api/login').send({
      username: 'testihenni',
      password: 'salasana'
    }).expect(200)

    token = loginRes.body.token
  })

  test('blog can be added by logged in user ', async () => {

    const newBlog = {
      title: 'leipurihiiva',
      author: "HENni",
      url: "www",
      likes: 9
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(titles.includes('leipurihiiva'))
  })

  test('adding blog fails with correct error code if you are not logged in user ', async () => {

    const newBlog = {
      title: 'leipurihiiva',
      author: "HENni",
      url: "www",
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes('leipurihiiva'))
  })

  test('blog without title is not added', async () => {

    const newBlog = {
        author: "hemppa",
        url: "wwwpistehemppapistefi",
        likes: 6
      }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
      const newBlog = {
          title: "urlismissing",
          author: "hemppa",
          likes: 6
        }
      
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
      
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog can be deleted by creator', async () => {

    const newBlog = {
      title: 'willbedeleted',
      author: "HENni",
      url: "www",
      likes: 9
    }

    createBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogToDeleteID = createBlog.body.id
    const blogsBeforeDeleting = (await helper.blogsInDb()).length

    await api
      .delete(`/api/blogs/${blogToDeleteID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(n => n.title)
    assert(!titles.includes(createBlog.body.title))

    assert.strictEqual(blogsBeforeDeleting,blogsAtEnd.length + 1)
  })

  test('blog added without number of likes and will get likes : 0 ', async () => {
    const newBlog = {
      title: 'leipurihiiva',
      author: "HENni",
      url: "www"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
    assert.strictEqual(lastBlog.likes, 0)
  })
})

describe('changing existing blogs', () => {
  test('the amount of likes can be changed on a specific blog ', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToModify = blogsAtStart[0]
    const likesBefore = blogToModify.likes

    const changedBlog =   {
      title: blogToModify.title,
      author: blogToModify.author,
      url: blogToModify.url,
      likes: 10,
      }

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(changedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const updatedBlog = blogsAtEnd.find(b => b.id === blogToModify.id)
    assert.strictEqual(updatedBlog.likes, 10)
    assert.notStrictEqual(likesBefore, 10)
  })
})

describe('creating account', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'hennipenni',
      name: 'Henni Seppänen',
      password: 'enkerro',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is not found', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('username needs to be at least 3 characters'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "bo",
      name: 'Superuser',
      password: 'salainen',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('username needs to be at least 3 characters'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is not found', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "käyttäjänumber1",
      name: 'Superuser'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('password needs to be at least 3 characters'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "käyttäjä",
      name: 'Superuser',
      password: 'sa',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('password needs to be at least 3 characters'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})
