const express = require('express');
const { home } = require('../controllers/site-controller');
const router = express.Router();

/**
 * @does retrieves and returns home page data
 * @route GET /api/v1/home
 * @protected false
 */
router.get('/').use(home);

module.exports = router;
