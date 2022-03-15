const express = require('express');
const { about } = require('../controllers/site-controller');
const router = express.Router();

router.get('/').use(about);

module.exports = router;
