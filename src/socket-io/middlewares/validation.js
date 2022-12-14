import { AuthenticationError, ForbiddenError } from '../../api/helpers/error.js'
import UsersService from '../../api/services/user.js'
import { verifyToken } from '../../api/helpers/jwt.js'
import UserSocketController from '../controllers/user.js'

const userService = new UsersService()

export async function socketValidateRequest(socket, next) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) throw new AuthenticationError('invalid token');
    
    const user = verifyToken(token);
    const userAgent = socket.request?.headers['user-agent'];
    if (!userAgent) throw new ForbiddenError('invalid user agent');

    
    const found_user = await userService.getUser({ _id: user._id });
    if (!found_user) throw new AuthenticationError('user is not defined!');
    
    const userSocketController = new UserSocketController();
    
    socket.token = token;
    const { data: { user: updatedUser } } = await userSocketController.updateUserSocketID(socket);

    updatedUser.socket_id = socket.id;
    socket.user = updatedUser;

    next();
  } catch (error) {
    console.error(error);
    socket.emit('error', error);
    next(error);
  }
}
