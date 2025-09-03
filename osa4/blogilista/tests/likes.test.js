const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithOneBlog = [
        {
            "title": "Leipiä",
            "author": "Rolle Ruokanen",
            "url": "kolmosweepisteruokapistecom",
            "likes": 5,
            "id": "67fe01732a2b8d7867be9686"
        }
    ]
  
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
  })




