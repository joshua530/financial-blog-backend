const headerSetter = (req, res, next) => {
  res.setHeader('Access-control-allow-origin', '*');
  res.setHeader('Access-control-allow-headers', 'content-type');
  res.setHeader('Access-control-allow-methods', 'PUT,POST,GET');
  next();
};

module.exports = headerSetter;
