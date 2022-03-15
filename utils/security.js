const crypto = require('crypto');
const {
  secretKey,
  numIterations,
  keyLength,
  algoUsed,
  encoding
} = require('../config/secret-key');

const passwordHash = (password) => {
  const hash = crypto
    .pbkdf2Sync(password, secretKey, numIterations, keyLength, algoUsed)
    .toString(encoding);
  return hash;
};

module.exports = passwordHash;
