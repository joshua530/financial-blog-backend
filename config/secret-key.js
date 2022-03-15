// generated using
// const salt = crypto.randomBytes(32).toString('base64');

const secretKey = process.env.SECRET_KEY;
const numBytes = 32;
const numIterations = 80000;
const keyLength = 64;
const algoUsed = 'sha512';
const encoding = 'base64';

module.exports = {
  secretKey,
  numBytes,
  numIterations,
  keyLength,
  algoUsed,
  encoding
};
