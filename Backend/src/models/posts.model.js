

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Post text cannot be empty'],
    trim: true,
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    default: 'Anonymous',
  },
  group: {
    type: mongoose.Schema.ObjectId, 
    ref: 'group',
    required: [true, 'Post must belong to a group'],
  },
}, { timestamps: true });

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;