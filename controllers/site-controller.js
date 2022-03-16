const asyncHandler = require('express-async-handler');
const Post = require('../models/post-model');
const { cleanPost } = require('../utils/models');

/**
 * @does fetches home page
 * @path /api/v1/home
 * @protected false
 */
const home = asyncHandler(async (req, res) => {
  const imageUrl = '<img url>';
  const introText = 'Welcome to our site where people share financial ideas';
  const posts = await Post.find().limit(10).sort({ _id: 'desc' });

  const latestPosts = [];
  posts.forEach((post) => {
    latestPosts.push(cleanPost(post, true));
  });

  const resData = { imageUrl, introText, latestPosts };
  res.status(200).json(resData);
});

/**
 * @does fetches about page
 * @path /api/v1/about
 * @protected false
 */
const about = (req, res) => {
  const aboutPage = {
    welcomeText: 'Welcome to our site where people share financial ideas',
    aboutText:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus delectus, provident ab quos unde magnam eos beatae est possimus blanditiis reiciendis et consectetur sit ex quidem veniam. Sapiente, repudiandae temporibus!',
    missionText:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam natus quo sit cum, aliquam cumque dolorum quis, molestiae, voluptatibus consequuntur quas soluta. Porro, voluptate accusamus at maiores odio eum eaque?',
    welcomeImage: '<image url>'
  };
  res.status(200).json(aboutPage);
};

module.exports = { home, about };
