import MessageSocketController from "../controllers/message.js";
import { InternalServerError } from "../../api/helpers/error.js";
import { socketBodyParser } from "../helpers/json.parser.js";


export async function MessageSocketRoute (socket) {
  if (!socket) throw new InternalServerError("Socket is not defined!");

  const messageSocketController = new MessageSocketController(socket);

  socket.use(socketBodyParser);
  socket.on('post-new-text-message', (body) => messageSocketController.POST_NEW_TEXT_MESSAGE(body));
  socket.on('patch-edit-message', (body) => messageSocketController.PATCH_EDIT_MESSAGE(body));
  socket.on('delete-message', (body) => messageSocketController.DELETE_MESSAGE(body));
}