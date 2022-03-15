const express = require('express');
const {
  viewProfile,
  updateProfile
} = require('../controllers/profile-controller');
const router = express.Router();

router.route('/:slug').get(viewProfile);
router.route('/:slug/update').put(updateProfile);

module.exports = router;
