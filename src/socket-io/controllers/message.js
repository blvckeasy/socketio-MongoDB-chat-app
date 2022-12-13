import fetch from "node-fetch";
import { server } from "../../../config.js";
import { NotFoundException } from "../../api/helpers/error.js"
import { verifyToken } from "../../api/helpers/jwt.js"

export default class MessageSocketController {
  #apiURL;
  
  constructor () {
    this.#apiURL = server.url();
  }

  async postMessage(socket, body) {
    const { token } = socket;

    // console.log('s1:', socket.request.headers['user-agent']);
    console.log(`user:`,verifyToken(token));
    console.log("\n\n");

    const response = await fetch(this.#apiURL + "/messages/new", {
      method: "POST",
      headers: {
        'Authorization': `Beaber ${token}`,
        'Content-Type': 'application/json',
        'user-agent': socket.request.headers['user-agent']
      },
      body: JSON.stringify(body)
    });

    return await response.json();
  }

  async editMessage(socket, body) {
    const { token } = socket;
    const { id: message_id } = body;

    const response = await fetch(this.#apiURL + `/message/edit/${message_id}`, {
      method: "PATCH",
      headers: {
        'Authorization': `Beaber ${token}`,
        'Content-Type': 'application/json',
        'user-agent': socket.request.headers['user-agent']
      },
      body: JSON.stringify(body)
    })

    return await response.json();
  }

  async deleteMessage(socket, body) {
    const { token } = socket;
    const { id: message_id } = body;
    
    const response = await fetch(this.#apiURL + `/message/delete/${message_id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Beaber ${token}`,
        'Content-Type': 'application/json',
        'user-agent': socket.request.headers['user-agent']
      },
      body: JSON.stringify(body)
    })

    return await response.json();
  }

  async deleteChat(socket, body) {
    const { token } = socket;
    const { user_id } = body; 

    const response = await fetch(this.#apiURL + `/messages/delete/chat/${user_id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Beaber ${token}`,
        'Content-Type': 'application/json',
        'user-agent': socket.request.headers['user-agent']
      },
      body: JSON.stringify(body)
    })

    return await response.json();
  }
}