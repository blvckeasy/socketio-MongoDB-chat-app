import fetch from "node-fetch";
import { server } from "../../../config.js";

export default class MessageSocketController {
  #apiURL;
  
  constructor () {
    this.#apiURL = server.url();
  }

  async postMessage(socket, body) {
    const { token } = socket;

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
    const { message_id } = body;

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
    const { message_id } = body;
    
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