import { InternalServerError } from "../../api/helpers/error.js"
import UserSocketController from "../controllers/user.js";
import { socketBodyParser } from "../helpers/json.parser.js"

export async function UserSocketRoute (socket) {
  if (!socket) throw new InternalServerError("Socket is not found!");
  const userSocketController = new UserSocketController(socket);

  socket.use(socketBodyParser);
  socket.on('get', (body) => userSocketController.GET(body));
}