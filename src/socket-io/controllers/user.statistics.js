import UserStatisticsSocketService from "../services/user.statistics.js";
import { socketIOErrorHandler } from "../middlewares/error.handler.js"


export default class UserStatisticsSocketController {
  

  constructor (socket) {
    this.userStatisticsSocketService = new UserStatisticsSocketService(socket);
    this.socket = socket;
  }

  async userConnected() {
    try {
      const data = await this.userStatisticsSocketService.userConnected(this.socket); 
      this.socket.emit('connected', data);
      return this.socket.broadcast.emit('user-connected', data);
    } catch (error) {
      console.error(error)
      return socketIOErrorHandler(error, this.socket);
    }
  }

  async userDisconnected() {
    try {
      const disconnect_user = await this.userStatisticsSocketService.userDisconnected(this.socket);
      return this.socket.broadcast.emit('user-disconnected', disconnect_user);
    } catch (error) {
      console.error(error);
      return socketIOErrorHandler(error, this.socket);
    }
  }
}