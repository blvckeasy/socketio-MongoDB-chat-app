import MessageSocketService from "../services/message.js";
import { socketIOErrorHandler } from "../middlewares/error.handler.js";


export default class MessageSocketController {
  constructor (socket) {
    this.messageSocketService = new MessageSocketService();
    this.socket = socket;
  }

  async POST_NEW_TEXT_MESSAGE (body) {
    try {
      const new_message = await this.messageSocketService.postMessage(this.socket, body)

      this.socket.emit('get-new-text-message', new_message);
      return this.socket.to(found_user?.socket_id).emit('get-new-text-message', new_message);
    } catch (error) {
      console.error(error);
      return socketIOErrorHandler(error, this.socket);
    }
  }

  async PATCH_EDIT_MESSAGE (body) {
    try {
      const edited_message = await this.messageSocketService.editMessage(this.socket, body);
      const friend_user = edited_message.data.to_user;

      this.socket.emit('patch-edited-message', edited_message);
      return this.socket.to(friend_user.socket_id).emit('path-edited-message', edited_message);
    } catch (error) {
      console.error(error);
      return socketIOErrorHandler(error, this.socket);
    }
  }

  async DELETE_MESSAGE (body) {
    try {  
      const deleted_message = await this.messageSocketService.deleteMessage(this.socket, body);
      const friend_user = deleted_message.data.to_user;

      this.socket.emit('delete-deleted-message', deleted_message);
      return this.socket.to(friend_user.socket_id).emit('delete-deleted-message', deleted_message)
    } catch (error) {
      console.error(error);
      return socketIOErrorHandler(error, this.socket);
    }
  }
}