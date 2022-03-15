const asyncHandler = require('express-async-handler');
const { secretKey } = require('../config/secret-key');

/**
 * PUT /api/v1/profile/:slug/update-password
 */
const updatePassword = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400);
    throw new Error('User slug cannot be empty');
  }
  //TODO is user authenticated ie is the user the owner of the password?
  const user = await User.find({ slug });
  if (!user) {
    res.status(400);
    throw new Error('User with that slug does not exist');
  }
  const password =
    req.body.password === null ? req.body.password : req.body.password.trim();
  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }
  const hash = crypto
    .pbkdf2Sync(password, secretKey, 80000, 64, 'sha512')
    .toString('base64');
  const updatedUser = await User.findOneAndUpdate(
    { slug },
    { $set: { password: hash } }
  );
  res.status(200).json({ success: 'password was updated successfully' });
});

module.exports = updatePassword;
