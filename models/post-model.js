const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  _id: Number,
  title: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  datePosted: {
    type: Date,
    required: true
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now
  },
  userSlug: { type: String, required: true },
  userName: { type: String, required: true },
  slug: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('Post', postSchema);
