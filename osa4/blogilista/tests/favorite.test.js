const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
    const Bloglist = [
            {
                "title": "Leipiä",
                "author": "Rolle Ruokanen",
                "url": "kolmosweepisteruokapistecom",
                "likes": 5,
                "id": "67fe01732a2b8d7867be9686"
            },
            {
                "title": "Kakkuja",
                "author": "Rolle Ruokanen",
                "url": "kolmosweepisteruokapistecom",
                "likes": 8,
                "id": "67fccbb59e3bf885ad709c1c"
            },
        ]
      
        test('blog with most likes', () => {
          const result = listHelper.favoriteBlog(Bloglist)
          const expected = {
            "title": "Kakkuja",
            "author": "Rolle Ruokanen",
            "url": "kolmosweepisteruokapistecom",
            "likes": 8,
            "id": "67fccbb59e3bf885ad709c1c"
        }
          assert.deepStrictEqual(result, expected)
        })
      })
    
    
    