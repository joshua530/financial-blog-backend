const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');
const AutoIncrement = require('../models/autoincrement-model');
const passwordHash = require('../utils/security');
const {
  cleanUser,
  ensureEmailIsUnique,
  ensureUsernameIsUnique,
  createSlug
} = require('../utils/models');

/**
 * @does creates new user account
 * @route POST /sign-up
 * @protected false
 */
const signUp = asyncHandler(async (req, res) => {
  const username = req.body.username
    ? req.body.username.trim()
    : req.body.username;
  const email = req.body.email ? req.body.email.trim() : req.body.email;
  const password = req.body.password
    ? req.body.password.trim()
    : req.body.password;

  if (!username) {
    res.status(400);
    throw new Error('username cannot be empty');
  }
  if (!email) {
    res.status(400);
    throw new Error('email cannot be empty');
  }
  if (!email.match(/[a-zA-Z][a-zA-Z0-9]+@[a-zA-Z0-9]{3,}\.[a-zA-Z]{2,}/)) {
    res.status(400);
    throw new Error('invalid email provided');
  }
  if (!password) {
    res.status(400);
    throw new Error('password cannot be empty');
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error('password should be at least 8 characters long');
  }

  // get current user id
  let userId = await AutoIncrement.findOne({ collectionName: 'user' });
  if (!userId) {
    userId = await AutoIncrement.create({ collectionName: 'user' });
    if (!userId) {
      res.status(400);
      throw new Error(
        'cannot process request at this time. please try again later'
      );
    }
  }
  const id = userId.currentId;

  await ensureEmailIsUnique(req, res, email);
  await ensureUsernameIsUnique(req, res, username);

  let user = await User.create({
    _id: id,
    username,
    email,
    password: passwordHash(password),
    slug: createSlug(username)
  });

  // increment user id
  await AutoIncrement.findOneAndUpdate(
    { collection: 'user' },
    { currentId: id + 1 }
  );

  user = cleanUser(user);

  res.status(200).json(user);
});

module.exports = { signUp };
