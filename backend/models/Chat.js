const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  _id: String, // deterministic 1:1 id like: userA_userB (sorted)
  users: [String], // array of user ids (usernames or ids)
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  unreadCount: { type: Map, of: Number, default: {} } // unread per user
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
