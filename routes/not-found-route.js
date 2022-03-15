const express = require('express');
const router = express.Router();

const notFound = (req, res) => {
  res.status(404).send('404 not found');
};

router.route('/').all(notFound);

module.exports = router;
