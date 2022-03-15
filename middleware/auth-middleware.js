const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/secret-key');

const authenticate = (req, res, next) => {
  const token = req.body.token;
  const protectedRoutes = [/\/profile\/.+\/update/];
  const uri = req.path;
  for (let path in protectedRoutes) {
    if (uri.match(path)) {
      if (!token)
        res.status(401).json({ error: 'token required for authentication' });
      try {
        const decoded = jwt.verify(token, secretKey);
        const userSlug = decoded['user_slug'];
        const requestSlug = req.params.slug;
        if (userSlug !== requestSlug)
          res.status(403).json({ error: 'invalid token' });
      } catch (err) {
        res.status(401).json({ error: 'invalid token' });
      }
    }
  }
  return next();
};

module.exports = authenticate;
