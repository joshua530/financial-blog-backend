const express = require('express');
const { viewProfile } = require('../controllers/profile-controller');
const router = express.Router();

router.route('/:slug').get(viewProfile);

module.exports = router;
