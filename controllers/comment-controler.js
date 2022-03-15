const Post = require('../models/post-model');
const Comment = require('../models/comment-model');
const User = require('../models/user-model');
const AutoIncrement = require('../models/autoincrement-model');
const asyncHandler = require('express-async-handler');

/**
 * @does creates comment
 * @route POST /api/v1/comments/create
 * @protected true
 */
const createComment = asyncHandler(async (req, res) => {
  const content = req.body.content ? req.body.content.trim() : req.body.content;
  const postSlug = req.body.postSlug
    ? req.body.postSlug.trim()
    : req.body.postSlug;
  const userSlug = req.body.userSlug
    ? req.body.userSlug.trim()
    : req.body.userSlug;

  if (!content) {
    res.status(400);
    throw new Error('content cannot be empty');
  }
  if (!postSlug) {
    res.status(400);
    throw new Error('post slug cannot be empty');
  }
  if (!userSlug) {
    res.status(400);
    throw new Error('user slug cannot be empty');
  }

  const user = await User.findOne({ slug: userSlug });
  if (!user) {
    res.status(400);
    throw new Error('invalid token');
  }
  const userName = user.username;
  const currentId = await nextCommentId();
  const comment = await Comment.create({
    _id: currentId,
    content,
    postSlug,
    userName,
    userSlug
  });
  if (!comment) {
    res.status(400);
    throw new Error('cannot post comment at this time, try again later');
  }
  await incrementCommentId(currentId);
  let sanitizedComment = cleanComment(comment);
  return res.status(200).json(sanitizedComment);
});

const cleanComment = (comment) => {
  let newComment = {};
  Object.assign(newComment, comment.toJSON());
  newComment['id'] = comment['_id'];
  delete newComment['_id'];
  delete newComment['__v'];
  return newComment;
};

const nextCommentId = async () => {
  let current = await AutoIncrement.findOne({ collectionName: 'comments' });
  if (!current) {
    current = await AutoIncrement.create({ collectionName: 'comments' });
  }
  return current.currentId;
};

const incrementCommentId = async (currentId) => {
  await AutoIncrement.findOneAndUpdate(
    { collectionName: 'comments' },
    { currentId: currentId + 1 }
  );
};

/**
 * @does deletes comment
 * @route DELETE /api/v1/comments/delete/:id
 * @protected true
 */
const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userSlug = req.userSlug;

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    res.status(400);
    throw new Error('bad comment id');
  }
  if (comment.userSlug !== userSlug) {
    res.status(403);
    throw new Error('403, forbidden');
  }

  await Comment.findByIdAndDelete(commentId);
  res.status(200).send();
});

module.exports = { createComment, deleteComment };
