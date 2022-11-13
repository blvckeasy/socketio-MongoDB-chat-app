import UsersController from "../../api/controllers/user.js";

const userController = new UsersController()

export async function validateRequest (socket, next) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) {
      throw new Errors.AuthenticationError("invalid token")
    }

    const user = verifyToken(token);
    const found_user = await userController.getUser()
    next();
  } catch (error) {
    next(error); 
  }
}