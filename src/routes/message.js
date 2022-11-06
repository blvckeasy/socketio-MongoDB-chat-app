import { Router } from "express";
import MessageController from "../controllers/message.js";
import Message from '../database/models/message.js';
import User from '../database/models/user.js';

const router = Router();

const messageController = new MessageController(Message, User);

router.get("/messages", (req, res, next) => messageController.getMessages(req, res, next));
router.post("/messages/new", (req, res, next) => messageController.postMessage(req, res, next));
router.patch("/message/edit/:id", (req, res, next) => messageController.editMessage(req, res, next));
router.delete("/message/delete/:id", (req, res, next) => messageController.deleteMessage(req, res, next));


export default router;