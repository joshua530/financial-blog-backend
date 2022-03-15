const User = require('../models/user-model');

/************ user model ************/
/**
 * removes sensitive data that shouldn't be sent to the front end
 */
const cleanUser = (user) => {
  let tmp = {};
  Object.assign(tmp, user.toJSON());
  tmp['id'] = tmp['_id'];
  delete tmp['_id'];
  delete tmp['password'];
  delete tmp['__v'];
  return tmp;
};

const ensureEmailIsUnique = async (req, res, email) => {
  const userWithEmail = await User.find({ email });
  if (userWithEmail.length > 0) {
    res.status(400);
    throw new Error('user with that email already exists');
  }
};

const ensureUsernameIsUnique = async (req, res, username) => {
  const userWithUsername = await User.find({ username });
  if (userWithUsername.length > 0) {
    res.status(400);
    throw new Error('user with that username already exists');
  }
};

const createSlug = (name) => {
  return name.replace(/\s+/g, '-');
};

module.exports = {
  cleanUser,
  ensureEmailIsUnique,
  ensureUsernameIsUnique,
  createSlug
};
