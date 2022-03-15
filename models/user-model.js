const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: Number,
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
});

module.exports = mongoose.model('User', userSchema);
