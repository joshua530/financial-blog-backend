const headerSetter = (req, res, next) => {
  res.setHeader('Access-control-allow-origin', '*');
  next();
};

module.exports = headerSetter;
