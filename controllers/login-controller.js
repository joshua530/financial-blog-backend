const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const {
  secretKey,
  numIterations,
  keyLength,
  algoUsed
} = require('../config/secret-key');
const User = require('../models/user-model');
const passwordHash = require('../utils/security');
const { cleanUser } = require('../utils/models');
const { jwt } = require('jsonwebtoken');

/**
 * POST /api/v1/login
 */
const login = asyncHandler(async (req, res) => {
  const username = req.body.username
    ? req.body.username.trim()
    : req.body.username;
  const password = req.body.password
    ? req.body.password.trim()
    : req.body.password;
  if (!username) {
    res.status(400);
    throw new Error('Username cannot be empty');
  }
  if (!password) {
    res.status(400);
    throw new Error('Password cannot be empty');
  }
  const hash = passwordHash(password);

  let user = await User.findOne({ username, password: hash });
  if (!user) {
    res.status(400);
    throw new Error('User with given credentials does not exist');
  }

  user = cleanUser(user);
  const token = jwt;

  res.status(200);
  //TODO return some authentication details that the user can store
  // preferrably a cookie / token / oauth
});

/**
 * POST /api/v1/logout
 */
const logout = asyncHandler(async (req, res) => {
  //TODO get token and check whether user was previously authenticated
  // if not, return 400 with error
  // if so, deauthenticate user and return 200 status
});

module.exports = { login, logout };
