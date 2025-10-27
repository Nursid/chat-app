const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { sender, receiver } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    })
      .sort({ createdAt: 1 }) // oldest → newest
      .limit(200);
      
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });

  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
