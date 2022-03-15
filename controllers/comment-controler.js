const Post = require('../models/post-model');
const Comment = require('../models/comment-model');
const User = require('../models/user-model');

/**
 * POST /api/v1/comments/create
 */
const createComment = (req, res) => {
  const content = req.body.content;
  const postSlug = req.body.postSlug;
  Post.findOne({ slug: postSlug }, (err, post) => {
    if (err) {
      res.status(400);
      throw new Error('Invalid post slug');
    }
  });
  const userId = 0; //TODO get from auth
  const userSlug = ''; //TODO get from auth
  Comment.create({ content, postSlug, userId, userSlug }, (err, comment) => {
    if (err) {
      res.status(400);
      throw new Error(
        'Error occured while posting comment, refresh page and retry'
      );
    }
    res.json(comment);
  });
};

/**
 * POST /api/v1/comments/delete
 */
const deleteComment = (req, res) => {
  const _id = req.body.id;
  Comment.remove({ _id }, (err) => {
    if (err) {
      res.status(400);
      throw new Error('Comment with that id does not exist');
    }
    res.status(200);
  });
};

module.exports = { createComment, deleteComment };
