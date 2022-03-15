const mongoose = require('mongoose');

const autoIncrementSchema = mongoose.Schema({
  collectionName: String,
  currentId: {
    type: Number,
    default: 1,
    min: [1, 'Id cannot have a value less than one']
  }
});

module.exports = mongoose.model('AutoIncrement', autoIncrementSchema);
