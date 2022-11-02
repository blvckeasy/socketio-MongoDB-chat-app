import { Router } from "express";
import MessageController from "../controllers/message.js";
import Message from '../database/models/message.js'
import User from '../database/models/user.js'

const router = Router();

const messageController = new MessageController(Message, User)

router.get("/messages", (req, res) => messageController.getMessages(req, res));
router.post("/messages", (req, res) => messageController.postMessage(req, res));


export default router