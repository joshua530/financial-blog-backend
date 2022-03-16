const User = require('../models/user-model');
const Post = require('../models/post-model');
const asyncHandler = require('express-async-handler');
const {
  cleanUser,
  ensureEmailIsUnique,
  ensureUsernameIsUnique
} = require('../utils/models');
const jwt = require('jsonwebtoken');
const passwordHash = require('../utils/security');

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
  const numPosts = await Post.count({ userSlug: user.slug });
  user.numPosts = numPosts;
  res.status(200).json(user);
});

/**
 * @does updates user password
 * @route PUT /api/v1/profile/:slug/update-password
 * @protected true
 */
const updatePassword = asyncHandler(async (req, res) => {
  const password = req.body.password
    ? req.body.password.trim()
    : req.body.password;
  if (!password) {
    res.status(400);
    throw new Error('User password cannot be empty');
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }
  const slug = req.params.slug;
  const hash = passwordHash(password);
  const user = await User.updateOne({ slug }, { password: hash });
  if (!user.acknowledged) {
    res.status(400);
    throw new Error('Cannot update password at this time, try again later');
  }
  res.status(200).send();
});

/**
 * @does updates user profile
 * @route PUT /api/v1/profile/:slug/update
 * @protected true
 */
const updateProfile = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400);
    throw new Error('User slug cannot be empty');
  }
  let user = await User.findOne({ slug });
  if (!user) {
    res.status(400);
    throw new Error('User with that slug does not exist');
  }

  const username = req.body.username
    ? req.body.username.trim()
    : req.body.username;
  const email = req.body.email ? req.body.email.trim() : req.body.email;
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

  if (email !== user.email) {
    await ensureEmailIsUnique(req, res, email);
  }
  if (username !== user.username) {
    await ensureUsernameIsUnique(req, res, username);
  }
  let updatedUser = await User.updateOne(
    { slug },
    {
      username,
      email
    }
  );
  if (!updatedUser) {
    res.status(400).json({ error: 'could not update user' });
  } else {
    const updated = { username, email };
    res.status(200).json(updated);
  }
});

module.exports = { viewProfile, updateProfile, updatePassword };
