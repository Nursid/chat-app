const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { getRoomId } = require('../utils/roomId');

function initSocket(io) {

  // Map userId -> Set(socketId)
  const onlineMap = new Map();

  io.on('connection', (socket) => {
    // client should send handshake auth: { userId }
    // console.log(socket)
    const userId = socket.handshake.auth?.userId;
    console.log('socket connected', socket.id, 'user:', userId);

    if (userId) {
      const s = onlineMap.get(userId) || new Set();
      s.add(socket.id);
      onlineMap.set(userId, s);
      // notify other clients (optional)
      io.emit('user_online', { userId });
    }

    // join a chat room (client opens chat)
    socket.on('join_chat', async ({ chatId, userId: uid }) => {
      socket.join(chatId);
      console.log("====",chatId,uid)
      // mark messages as delivered for this user
      await Message.updateMany({ chatId, receiver: uid, delivered: false }, { delivered: true });
      io.to(chatId).emit('messages_delivered', { chatId, userId: uid });
    });




    // private message event
    socket.on('private_message', async (payload, ack) => {
      // payload: { from, to, text, chatId?, tempId? }
      try {
        const from = payload.from;
        const to = payload.to;
        const text = payload.text;
        const chatId = payload.chatId || getRoomId(from, to);
        // ensure chat exists
        let chat = await Chat.findById(chatId);
        if (!chat) {
          chat = await Chat.create({ _id: chatId, users: [from, to], unreadCount: {} });
        }

        const msg = await Message.create({ chatId, sender: from, receiver: to, text });

        console.log("msg---",msg)

        // update chat latestMessage and unread counts
        chat.latestMessage = msg._id;

        // detect if recipient is in room
        const recipientSockets = onlineMap.get(to);
        let recipientInRoom = false;
        if (recipientSockets) {
          for (const sid of recipientSockets) {
            const s = io.sockets.sockets.get(sid);
            if (s && s.rooms.has(chatId)) {
              recipientInRoom = true;
              break;
            }
          }
        }

        // update unread if not in room
        const prev = chat.unreadCount?.get(to) || 0;
        if (!recipientInRoom) chat.unreadCount.set(to, prev + 1);

        await chat.save();

        // Broadcast to the chat room
        const payloadOut = {
          message: {
            _id: msg._id,
            chatId,
            sender: from,
            receiver: to,
            text,
            createdAt: msg.createdAt,
            delivered: recipientInRoom,
            seen: false
          },
          tempId: payload.tempId || null
        };

        io.to(chatId).emit('new_message', payloadOut);

        if (typeof ack === 'function') ack({ ok: true, messageId: msg._id });
      } catch (err) {
        console.error('private_message error', err);
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    

    socket.on('message_seen', async ({ messageId, chatId, userId: uid }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { seen: true });
        // reset unread for this user in chat
        const chat = await Chat.findById(chatId);
        if (chat) {
          chat.unreadCount.set(uid, 0);
          await chat.save();
        }
        io.to(chatId).emit('message_seen', { messageId, chatId, userId: uid });
      } catch (err) {
        console.error('message_seen error', err);
      }
    });

    socket.on('disconnect', () => {
      if (userId) {
        const s = onlineMap.get(userId);
        if (s) {
          s.delete(socket.id);
          if (s.size === 0) {
            onlineMap.delete(userId);
            io.emit('user_offline', { userId });
          } else {
            onlineMap.set(userId, s);
          }
        }
      }
      console.log('socket disconnected', socket.id);
    });

  }); // end io.on('connection')
}

module.exports = { initSocket };
