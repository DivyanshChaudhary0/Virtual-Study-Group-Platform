
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Group subject is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  members: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const groupModel = mongoose.model('group', groupSchema);
 
module.exports = groupModel;