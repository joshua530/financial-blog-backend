const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/secret-key');

const authenticate = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    res.status(401).json({ error: 'token required for authentication' });
    return;
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const userSlug = decoded['user_slug'];
    const requestSlug = req.params.slug;
    if (userSlug !== requestSlug) {
      res.status(403).json({ error: 'invalid token' });
      return;
    }
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  next();
};

module.exports = authenticate;
