const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/secret-key');

const authenticate = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  const token = req.body.token;
  if (!token) {
    res.status(401).json({ error: 'token required for authentication' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userSlug = decoded['user_slug'];
    if (req.params.slug) {
      // request has user slug in url
      const requestSlug = req.params.slug;
      if (userSlug !== requestSlug) {
        res.status(403).json({ error: 'invalid token' });
        return;
      }
    } else {
      // request uses user slug in token for interacting with resources,
      // extract it so that it can be used wherever it is required
      req.userSlug = userSlug;
    }
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  next();
};

module.exports = authenticate;
