import fetch from "node-fetch";
import { server } from "../../../config.js";

export default class UserStatisticsSocketController {
  #apiURL;

  constructor () {
    this.#apiURL = server.url();
  }

  async userConnected (socket) {
    const { token } = socket;

    const response = await fetch(this.#apiURL + "/userStatistics/connect", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': socket.request.headers['user-agent'],
      },
      body: JSON.stringify({
        socketId: socket.id,
      })
    })

    return await response.json();
  }

  async userDisconnected (socket) {
    const { token } = socket;
    const response = await fetch(this.#apiURL + "/userStatistics/disconnect", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'user-agent': socket.request.headers['user-agent'],
      },
    })

    return await response.json();
  }
}