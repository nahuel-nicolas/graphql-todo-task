const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    null: true
  },
  created: {
    type: String,
  },
  updated: {
    type: String,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
