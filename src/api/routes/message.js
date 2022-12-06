import { Router } from "express";
import MessageController from "../controllers/message.js";
import Message from '../database/models/message.js';
import User from '../database/models/user.js';
import { tokenValidation } from "../middlewares/token.validation.js"

const router = Router();
const messageController = new MessageController(Message, User);

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - from_user_id
*          - to_user_id
*          - message
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the message
 *         from_user_id:
 *           type: string
 *           description: The id of the user who sent the message is written
 *         to_user_id:
 *           type: string
 *           description: The user id who received the message is written
 *         message: 
 *           type: string
 *           description: The message title
 *         sended_time: 
 *           type: string
 *           description: The date the message was sent
 *       example:
 *         id: 'e21c5de0-5a65-11ed-906a-cb9bfb8d2cce'
 *         from_user_id: 'b37d3377-60fb-4b1b-a269-3245a3833e18'
 *         to_user_id: '1846a314-d7a0-406d-a31e-62f21cdd0d12'
 *         message: 'hello world'
 *         sended_time: '2022-11-09T04:21:47.376Z'
 *      
 *     Error:
 *        type: object
 *        properties:
 *          ok:
 *            type: boolean
 *          error: 
 *            type: object
 *        example:
 *          ok: false
 *          error: {
 *            message: 'something error'
 *          }  
 */

 /**
  * @swagger
  * tags:
  *   name: Messages
  *   description: The messages managing API  
  */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Returns the list of all the messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: The list of the all Messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: 
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   $ref: '#/components/schemas/Message'
 *                   
 * 
 *       404: 
 *        description: somthing error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties: 
 *                ok: 
 *                  type: boolean
 *                error: 
 *                  type: object
 *              example: 
 *                ok: false
 *                error: {
 *                  error: "something wrong",
 *                  status: 400 
 *                }
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404: 
 *        description: somthing error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties: 
 *                ok: 
 *                  type: boolean
 *                error: 
 *                  type: object
 *              example: 
 *                ok: false
 *                error: {
 *                  error: "something wrong",
 *                  status: 400 
 *                }
 */

router.get("/messages", (req, res, next) => messageController.getMessages(req, res, next));
router.post("/messages/new", tokenValidation, (req, res, next) => messageController.postMessage(req, res, next));
router.patch("/message/edit/:id", tokenValidation, (req, res, next) => messageController.editMessage(req, res, next));
router.delete("/message/delete/:id", tokenValidation, (req, res, next) => messageController.deleteMessage(req, res, next));
router.delete("/messages/delete/chat/:user_id", tokenValidation, (req, res, next) => messageController.deleteChat(req, res, next));


export default router;