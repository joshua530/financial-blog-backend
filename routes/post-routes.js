const express = require('express');
const { createPost, viewPost } = require('../controllers/post-controller');
const router = express.Router();

router.route('/:slug').get(viewPost);
router.route('/new').post(createPost);

module.exports = router;
