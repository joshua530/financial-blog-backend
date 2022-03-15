const express = require('express');
const { createPost } = require('../controllers/post-controller');
const router = express.Router();

router.route('/new').post(createPost);

module.exports = router;
