const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((sum , item) => sum + item.likes, 0);
    
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, item) => item.likes > favorite.likes ? item : favorite)
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }