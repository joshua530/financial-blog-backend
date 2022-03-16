const headerSetter = (req, res, next) => {
  res.setHeader('Access-control-allow-origin', '*');
  res.setHeader('Access-control-allow-headers', 'content-type');
  next();
};

module.exports = headerSetter;
