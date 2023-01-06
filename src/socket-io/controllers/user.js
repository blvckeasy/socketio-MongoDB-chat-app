import UserSocketService from "../services/user.js";
import { socketIOErrorHandler } from "../middlewares/error.handler.js";


export default class UserSocketController {
  constructor (socket) {
    this.userSocketService = new UserSocketService();
    this.socket = socket;
  }

  async GET(body) {
    try {
      const id = body?.id

      if (id) {
        const user = await this.userSocketService.getUser(id)
        return this.socket.emit('get-user', user)
      }

      const users = await this.userSocketService.getUsers();
      return this.socket.emit('get-users', users)
    } catch (error) {
      console.error(error);
      return socketIOErrorHandler(error, this.socket);
    }
  }
}