const asyncHandler = require('express-async-handler');
const Post = require('../models/post-model');
const User = require('../models/user-model');
const Comment = require('../models/comment-model');

/**
 * POST /api/v1/posts/new
 */
const createPost = asyncHandler(async (req, res) => {
  //TODO is user authenticated?
  const title = req.body.title ? req.body.title.trim() : req.body.title;
  const content = req.body.content ? req.body.content.trim() : req.body.content;

  if (!title) {
    res.status(400);
    throw new Error('Post title cannot be empty');
  }
  if (!content) {
    res.status(400);
    throw new Error('Post content cannot be empty');
  }
  const userId = 0; // get user id from authentication means
  const user = User.findOne({ id: userId });
  if (!user) {
    res.status(401);
    throw new Error('User is not authenticated');
  }
  Post.create(
    { title, content, userId, datePosted: Date.now() },
    (err, newPost) => {
      if (err) {
        res.status(400);
        throw new Error(err.message);
      }
      res.status(200).json(newPost);
    }
  );
});

/**
 * GET /api/v1/posts/:slug
 */
const viewPost = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400);
    throw new Error('post slug cannot be empty');
  }
  const post = await Post.findOne({ slug });
  if (!post) {
    res.status(400);
    throw new Error('post with given slug does not exist');
  }
  const comments = await Comment.find({ postSlug: slug });
  const response = { post, comments };
  res.status(200).json(response);
});

/**
 * PUT /api/v1/post/:slug/update
 */
const updatePost = asyncHandler(async (req, res) => {
  //TODO authenticate user
  // check if user is owner
  const title = req.body.title ? req.body.title.trim() : req.body.title;
  const content = req.body.content ? req.body.content.trim() : req.body.content;
  const slug = req.body.slug;
  const post = await Post.findOne({ slug });
  if (!post) {
    res.status(400);
    throw new Error('Post with slug ' + slug + ' does not exist');
  }
  post.title = title;
  post.content = content;
  await post.save();
  res.status(200).json(post);
});

/**
 * DELETE /api/v1/posts/:slug/delete
 */
const deletePost = asyncHandler(async (req, res) => {
  // TODO user auth and user is owner of post
  const slug = req.params.slug;
  Post.deleteOne({ slug }, (err) => {
    if (err) {
      res.status(400);
      throw new Error(`Post with slug "${slug}" does not exist`);
    }
    res.status(200);
  });
});

/**
 * GET /api/v1/posts/:slug
 */
const userPosts = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const posts = Post.find({ slug });
  res.status(200);
  res.json(posts);
});

module.exports = { createPost, deletePost, updatePost, viewPost, userPosts };
