import fetch from "node-fetch";
import { server } from "../../../config.js"
import { InternalServerError, NotFoundException } from "../../api/helpers/error.js"
import * as CustomeErrors from '../../api/helpers/error.js';


export default class UserSocketController {
  #apiURL;

  constructor () {
    this.#apiURL = server.url();
  }

  async getUsers() {
    let response = await fetch(this.#apiURL + "/users");
    response = await response.json();
    
    if (!response.ok) throw new CustomeErrors[response.error?.name](response.error.message);
    return response;
  }

  async getUser(id) {
    if (!id) throw new NotFoundException("id is require!");
    
    let response = await fetch(this.#apiURL + "/users/" + id);
    response = await response.json();

    if (!response.ok) throw new CustomeErrors[response.error?.name](response.error.message);
    return response;
  }

  async updateUserSocketID(socket) {
    if (!socket) throw new InternalServerError("socket is not defined!");
    
    const { token } = socket;
    if (!token) throw new NotFoundException("token not found!");
    
    let response = await fetch(this.#apiURL + "/users/update/socketID", {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': socket.request.headers['user-agent'],
      },
      body: JSON.stringify({
        socketID: socket.id,
      })
    });    
    response = await response.json();

    if (!response.ok) throw new CustomeErrors[response.error?.name](response.error.message);
    return response;
  }
}