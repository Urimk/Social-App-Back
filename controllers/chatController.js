import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

export const addChat = async (req, res) => {
  try {
    const displayName = req.params.display;
    const sender = await User.findOne({ displayName });
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }
    const receiverId = req.user.id;
    const newChat = new Chat({
      users: [sender._id, receiverId],
      messages: [],
    });
    await newChat.save();
    await User.findByIdAndUpdate(receiverId, {
      $pull: { pendingRequests: sender._id },
      $addToSet: {
        chats: newChat._id,
        contacts: sender._id,
      },
    });
    sender.contacts.push(receiverId);
    sender.chats.push(newChat._id);
    sender.save();
    const lastMessage = null;
    return res.status(201).json({
      message: "Chat created successfully",
      chat: {
        id: newChat._id,
        friendId: sender._id,
        friendName: sender.displayName,
        lastMessage: lastMessage,
      },
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChats = async (req, res) => {
  try {
    const existingUser = req.user;
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let chats = [];
    let shortChat;
    for (const chatId of existingUser.chats) {
      const chat = await Chat.findById(chatId);
      if (!chat) continue;
      for (const userId of chat.users) {
        const user = await User.findById(userId);
        if (user.displayName != existingUser.displayName) {
          let lastMessage = await Message.findById(
            chat.messages[chat.messages.length - 1],
          );
          shortChat = {
            id: chat._id,
            friendId: user._id,
            friendName: user.displayName,
            image: user.image,
            lastMessage,
          };
          chats.push(shortChat);
          break;
        }
      }
    }
    return res.status(200).json({ chats });
  } catch (error) {
    console.error("Error loading Message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLastMessage = async (req, res) => {
  try {
    const chatId = req.params.id;
    const existingChat = await Chat.findOne({ chatId });
    if (!existingChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (existingChat.messages.length === 0) {
      return res.status(200).json({});
    }
    const lastMessageId =
      existingChat.messages[existingChat.messages.length - 1];
    const message = await Message.findOne({ lastMessageId });
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(message);
  } catch (error) {
    console.error("Error loading Message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const existingChat = await Chat.findById(chatId);
    if (!existingChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const messages = [];
    let message;
    for (let messageId of existingChat.messages) {
      message = await Message.findById(messageId);
      messages.push(message);
    }
    return res.status(200).json({
      messages: messages,
      currentUser: req.user.id,
    });
  } catch (error) {
    console.error("Error loading Message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user.id;
    const content = req.body.content;
    const existingChat = await Chat.findById(chatId);
    if (!existingChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const toUserId = existingChat.users.filter(
      (id) => id.toString() !== userId.toString(),
    );
    const newMessage = new Message({
      text: content,
      authorId: userId,
      chatId: chatId,
    });
    await newMessage.save();
    existingChat.messages.push(newMessage._id);
    existingChat.save();
    const io = req.app.get("io");
    console.log("Rooms currently active:", io.sockets.adapter.rooms);
    console.log(
      "Am I trying to send to a valid room?",
      io.sockets.adapter.rooms.has(toUserId.toString()),
    );
    io.to(toUserId.toString()).emit("message_received", newMessage);
    console.log("send to ", toUserId.toString());
    return res
      .status(200)
      .json({ message: "Added new message", messageObj: newMessage });
  } catch (error) {
    console.error("Error loading Message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
