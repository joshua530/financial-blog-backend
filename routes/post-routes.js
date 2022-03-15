const express = require('express');
const {
  createPost,
  viewPost,
  updatePost,
  deletePost
} = require('../controllers/post-controller');
const router = express.Router();

router.route('/:post_slug').get(viewPost);
router.route('/:post_slug/update').put(updatePost);
router.route('/:post_slug/delete').delete(deletePost);
router.route('/new').post(createPost);

module.exports = router;
