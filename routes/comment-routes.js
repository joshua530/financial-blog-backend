const express = require('express');
const { createComment } = require('../controllers/comment-controler');
const router = express.Router();

router.route('/create').post(createComment);

module.exports = router;
