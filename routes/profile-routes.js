const express = require('express');
const {
  viewProfile,
  updateProfile,
  updatePassword
} = require('../controllers/profile-controller');
const router = express.Router();

router.route('/:slug').get(viewProfile);
router.route('/:slug/update').put(updateProfile);
router.route('/:slug/update-password').put(updatePassword);

module.exports = router;
