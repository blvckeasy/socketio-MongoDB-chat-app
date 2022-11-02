import { Router } from "express";
import MessageController from "../controllers/message.js";
import Message from '../database/models/message.js'
import User from '../database/models/user.js'

const router = Router();

const messageController = new MessageController(Message, User)

router.get("/messages", (req, res) => messageController.getMessages(req, res));
router.post("/messages/new", (req, res) => messageController.postMessage(req, res));
router.patch("/message/edit/:id", (req, res) => messageController.editMessage(req, res));
router.delete("/message/delete/:id")


export default router