const asyncHandler = require('express-async-handler');
const Post = require('../models/post-model');
const User = require('../models/user-model');
const Comment = require('../models/comment-model');
const AutoIncrement = require('../models/autoincrement-model');
const { createSlug, randomToken } = require('../utils/models');

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

  const userSlug = req.userSlug;
  const user = await User.findOne({ slug: userSlug });
  if (!user) {
    res.status(401);
    throw new Error('Invalid authentication token');
  }
  const nextId = await nextPostId();
  const slug = randomToken();
  const userName = user.username;
  const post = await Post.create({
    title,
    content,
    userSlug,
    datePosted: Date.now(),
    slug,
    userName,
    _id: nextId
  });
  if (!post) {
    res.status(400);
    throw new Error('cannot create post at this time');
  }
  await incrementPostId(nextId);
  res.status(200).json(post);
});

const cleanPost = (post) => {
  let newPost = {};
  Object.assign(newPost, post);
  newPost['id'] = post['id'];
  newPost;
};

const nextPostId = async () => {
  let current = await AutoIncrement.findOne({ collectionName: 'posts' });
  if (!current) {
    current = await AutoIncrement.create({ collectionName: 'posts' });
  }
  return current.currentId;
};

const incrementPostId = async (currentId) => {
  await AutoIncrement.findOneAndUpdate(
    { collectionName: 'posts' },
    { currentId: currentId + 1 }
  );
};

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
