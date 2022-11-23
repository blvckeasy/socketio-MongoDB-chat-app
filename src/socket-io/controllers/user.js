import fetch from "node-fetch";
import { server } from "../../../config.js";

export default class UserSocketController {

  constructor () {
    this.apiURL = server.url(); 
  }

  async userConnected (socket) {
    const { token } = socket;
    const response = await fetch(this.apiURL + "/userStatistics/connect", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log(await response.json())

    return await response;
  }

  async userDisconnected (socket) {
    const { token } = socket;
    const response = await fetch(this.apiURL + "/userStatistics/disconnect", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log(await response)

    return await response;
  }
}