const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  postSlug: {
    type: String,
    required: true,
    index: true
  },
  userSlug: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  _id: Number
});

module.exports = mongoose.model('Comment', commentSchema);
