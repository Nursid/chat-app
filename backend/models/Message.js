const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String, required: true },
  delivered: { type: Boolean, default: false },
  seen: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
