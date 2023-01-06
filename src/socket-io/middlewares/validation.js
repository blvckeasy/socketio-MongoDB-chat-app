import { AuthenticationError, ForbiddenError, UnAuthorizationError } from '../../api/helpers/error.js'
import UsersService from '../../api/services/user.js'
import { verifyToken } from '../../api/helpers/jwt.js'
import UserSocketService from '../services/user.js'

const userService = new UsersService();


export async function socketValidateRequest(socket, next) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) throw new AuthenticationError('Invalid token');
    
    const user = verifyToken(token);
    const userAgent = socket.request?.headers['user-agent'];
    if (!userAgent) throw new ForbiddenError('invalid user agent');

    
    const found_user = await userService.getUser({ _id: user._id });
    if (!found_user) throw new AuthenticationError('user is not defined!');
    
    console.log('ok9');

    const userSocketService = new UserSocketService();
    
    socket.token = token;
    console.log('ok10', token)
    const { data: { user: updatedUser } } = await userSocketService.updateUserSocketID(socket);

    console.log('ok15');

    if (!updatedUser) throw new UnAuthorizationError("user not authorization!");

    updatedUser.socket_id = socket.id;
    socket.user = updatedUser;

    console.log('ok20');
    next();
  } catch (error) {
    socket.emit('error', error.message);
    next(error);
  }
}
