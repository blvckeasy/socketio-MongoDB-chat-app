import { AuthenticationError } from "../../api/helpers/error.js";
import UsersService from "../../api/services/user.js"
import { verifyToken } from '../../api/helpers/jwt.js'

const userService = new UsersService()


export async function socketValidateRequest (socket, next) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) throw new AuthenticationError("invalid token")

    const user = verifyToken(token);
    const found_user = await userService.getUser({ _id: user._id });
    if (!found_user) throw new AuthenticationError("user is not defined!");

    next();
  } catch (error) {
    next(error); 
  }
}