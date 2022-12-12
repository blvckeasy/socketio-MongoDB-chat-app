import fetch from "node-fetch";
import { server } from "../../../config.js"
import { InternalServerError, NotFoundException } from "../../api/helpers/error.js"

export default class UserSocketController {
  #apiURL;

  constructor () {
    this.#apiURL = server.url();
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

  // coming soon... ----
  // async updateUserSocketID(socket) {
  //   if (!socket) throw new InternalServerError("socket is not defined!");
  //   const user = await fetch(this.#apiURL + "/users")
  // }
  // ---------
}