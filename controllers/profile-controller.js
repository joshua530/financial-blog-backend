const User = require('../models/user-model');
const asyncHandler = require('express-async-handler');
const { cleanUser } = require('../utils/models');

/**
 * @does fetches user profile
 * @route GET /api/v1/profile/:slug
 * @protected false
 */
const viewProfile = asyncHandler(async (req, res) => {
  let user = await User.findOne({
    slug: req.params.slug
  });
  if (!user) {
    res.status(400);
    throw new Error('User with that slug does not exist');
  }
  user = cleanUser(user);
  res.status(200).json(user);
});

/**
 * @does updates user profile
 * @route GET /api/v1/profile/:slug/update
 * @route PUT /api/v1/profile/:slug/update
 * @protected true
 */
const updateProfile = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400);
    throw new Error('User slug cannot be empty');
  }
  const user = User.findOne({ slug });
  if (!user) {
    res.status(400);
    throw new Error('User with that slug does not exist');
  }

  //PUT
  if (req.method === 'PUT') {
    // TODO get authentication details
    // if user is not authenticated, return error with 401 response
    const username =
      req.body.username === null ? req.body.username : req.body.username.trim();
    const email =
      req.body.email === null ? req.body.email : req.body.email.trim();
    if (!username) {
      res.status(400);
      throw new Error('Username cannot be empty');
    }
    if (!email) {
      res.status(400);
      throw new Error('Password cannot be empty');
    }
    if (!email.match(/[a-zA-Z][a-zA-Z0-9]+@[a-zA-Z0-9]{3,}\.[a-zA-Z]{2,}/)) {
      res.status(400);
      throw new Error('invalid email provided');
    }
    const updatedUser = await User.updateOne(
      { slug },
      {
        $set: {
          username,
          email
        }
      }
    );
    res.status(200).json(updatedUser);
  } else {
    res.status(200).json({ username: user.username, email: user.email });
  }
});

module.exports = { viewProfile, editProfile: updateProfile };
