const asyncHandler = require('express-async-handler');
const Post = require('../models/post-model');
const User = require('../models/user-model');
const Comment = require('../models/comment-model');
const {
  randomToken,
  nextPostId,
  incrementPostId,
  cleanPost,
  cleanComment
} = require('../utils/models');

/**
 * @does creates new post
 * @route POST /api/v1/posts/new
 * @protected true
 */
const createPost = asyncHandler(async (req, res) => {
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
  let post = await Post.create({
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
  post = cleanPost(post);
  res.status(200).json(post);
});

/**
 * @does gets post data
 * @route GET /api/v1/posts/:post_slug
 * @protected false
 */
const viewPost = asyncHandler(async (req, res) => {
  const slug = req.params.post_slug;
  if (!slug) {
    res.status(400);
    throw new Error('post slug cannot be empty');
  }
  let post = await Post.findOne({ slug });
  if (!post) {
    res.status(400);
    throw new Error('post with given slug does not exist');
  }
  post = cleanPost(post);
  const comments = await Comment.find({ postSlug: slug }).sort({ _id: 'desc' });
  let cleanComments = [];
  comments.forEach((comment) => cleanComments.push(cleanComment(comment)));
  const response = { post, comments: cleanComments };
  res.status(200).json(response);
});

/**
 * @does updates post data
 * @route PUT /api/v1/posts/:post_slug/update
 * @protected true
 */
const updatePost = asyncHandler(async (req, res) => {
  const title = req.body.title ? req.body.title.trim() : req.body.title;
  const content = req.body.content ? req.body.content.trim() : req.body.content;
  const slug = req.params.post_slug;
  let post = await Post.findOne({ slug });
  if (!post) {
    res.status(400);
    throw new Error("Post with slug '" + slug + "' does not exist");
  }
  const userSlug = req.userSlug;
  if (post.userSlug !== userSlug) {
    res.status(403).send('403 forbidden');
    return;
  }

  post.title = title;
  post.content = content;
  post.dateUpdated = Date.now();
  await post.save();

  post = cleanPost(post);
  res.status(200).json(post);
});

/**
 * @does deletes post
 * @route DELETE /api/v1/posts/:post_slug/delete
 * @protected true
 */
const deletePost = asyncHandler(async (req, res) => {
  const slug = req.params.post_slug;
  const post = await Post.findOne({ slug });
  const userSlug = req.userSlug;
  if (post.userSlug !== userSlug) {
    res.status(403).send('403 forbidden');
    return;
  }
  const result = await Post.deleteOne({ slug });
  if (result.deletedCount !== 1) {
    res.status(400);
    throw new Error('post deletion failed');
  }
  res.status(200).json({ success: 'post deleted successfully' });
});

/**
 * @does gets posts belonging to a certain user
 * @route GET /api/v1/posts/:slug
 * @protected false
 */
const userPosts = asyncHandler(async (req, res) => {
  const slug = req.params.user_slug;

  const user = await User.find({ slug });
  if (!user) {
    res.status(400);
    throw new Error('user with that slug does not exist');
  }

  const posts = await Post.find({ userSlug: slug });
  let cleanedPosts = [];
  posts.forEach((post) => cleanedPosts.push(cleanPost(post, true)));
  res.status(200).json(cleanedPosts);
});

module.exports = { createPost, deletePost, updatePost, viewPost, userPosts };
