const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ?? 500;
  res.status(statusCode);
  let response = { error: err.message };
  if (process.env.ENVIRONMENT !== 'production') {
    response['stack'] = error.stack;
  }
  res.json(response);
};

module.exports = errorHandler;
