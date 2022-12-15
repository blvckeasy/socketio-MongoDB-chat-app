import fetch from "node-fetch";
import { server } from "../../../config.js";
import * as CustomeErrors from '../../api/helpers/error.js';


export default class UserStatisticsSocketController {
  #apiURL;

  constructor () {
    this.#apiURL = server.url();
  }

  async userConnected (socket) {
    const { token } = socket;

    let response = await fetch(this.#apiURL + "/userStatistics/connect", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': socket.request.headers['user-agent'],
      },
      body: JSON.stringify({
        socketId: socket.id,
      })
    });
    response = await response.json();
    
    if (!response.ok) throw new CustomeErrors[response.error?.name](response.error.message);
    return response;
  }

  async userDisconnected (socket) {
    const { token } = socket;
    let response = await fetch(this.#apiURL + "/userStatistics/disconnect", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'user-agent': socket.request.headers['user-agent'],
      },
    });
    response = await response.json();
    
    if (!response.ok) throw new CustomeErrors[response.error?.name](response.error.message);
    return response;
  }
}