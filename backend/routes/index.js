const express = require('express');
const router = express.Router();
// const messageController = require('../controllers/messageController');
const chatController = require('../controller/chatController');
const messageController = require("../controller/messageController")
const userController = require("../controller/userController")

router.get('/chats/:chatId', chatController.getChat);

router.get("/message/:sender/:receiver", messageController.getMessages);


router.post("/user/add",userController.addUser)
router.get("/user/getall",userController.getUser)
router.post("/user/login",userController.loginUser)


module.exports = router;
