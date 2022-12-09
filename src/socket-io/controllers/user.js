import fetch from "node-fetch";
import { server } from "../../../config.js";
import { NotFoundException } from "../../api/helpers/error.js"

export default class UserSocketController {
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
        'user-agent': socket.request.headers['user-agent'],
      },
      body: JSON.stringify({
        socket_id: socket.id,
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

  async getUsers() {
    const users = await fetch(this.#apiURL + "/users");
    return await users.json();
  }

  async getUser(id) {
    if (!id) throw new NotFoundException("id is require!");
    
    const user = await fetch(this.#apiURL + "/users/" + id);
    return await user.json();
  }

}