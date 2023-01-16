import { InternalServerError } from "../../api/helpers/error.js";
import UserStatisticsSocketController from "../controllers/user.statistics.js";
import { socketBodyParser } from "../helpers/json.parser.js";


export async function UserStatisticsSocketRoute (socket) {
  if (!socket) throw new InternalServerError("Socket is not defined!");

  const userStatisticsSocketController = new UserStatisticsSocketController(socket);

  socket.use(socketBodyParser);

  await userStatisticsSocketController.userConnected();
  
  socket.on('user-disconnected', async () => await userStatisticsSocketController.userDisconnected());
  socket.on('disconnect', async () => await userStatisticsSocketController.userDisconnected());

}