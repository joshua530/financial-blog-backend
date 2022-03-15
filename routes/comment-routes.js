const express = require('express');
const {
  createComment,
  deleteComment
} = require('../controllers/comment-controler');
const router = express.Router();

router.route('/create').post(createComment);
router.route('/delete/:id').delete(deleteComment);

module.exports = router;
