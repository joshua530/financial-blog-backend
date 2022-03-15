const express = require('express');
const {
  createPost,
  viewPost,
  updatePost,
  deletePost,
  userPosts
} = require('../controllers/post-controller');
const router = express.Router();

router.route('/:post_slug').get(viewPost);
router.route('/:post_slug/update').put(updatePost);
router.route('/:post_slug/delete').delete(deletePost);
router.route('/users/:user_slug').get(userPosts);
router.route('/new').post(createPost);

module.exports = router;
