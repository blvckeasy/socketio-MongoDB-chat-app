import Http from 'http'
import Express from 'express'
import { Server as Socket } from 'socket.io'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import { mongooseConnect } from './api/database/mongoose.js'
import userRoutes from './api/routes/user.js'
import messageRoutes from './api/routes/message.js'
import userStatistics from './api/routes/user.statistics.js'
import { errorHandler } from './api/middlewares/error.handler.js'
import { socketValidateRequest } from './socket-io/middlewares/validation.js'
import {
  logger as loggerConfig,
  server as serverConfig,
  cors as corsConfig,
  swagger as swaggerOptions,
} from '../config.js'
import UserStatisticsSocketController from './socket-io/controllers/user.statistics.js'
import MessageSocketController from './socket-io/controllers/message.js'
import { socketIOErrorHandler } from './socket-io/middlewares/error.handler.js'
import { socketBodyParser } from './socket-io/helpers/json.parser.js'
import { NotFoundException, UnAuthorizationError } from './api/helpers/error.js'
import UserSocketController from './socket-io/controllers/user.js'
import MessageService from './api/services/message.js'
import UsersService from './api/services/user.js'


async function bootstrap() {
  const HOST = serverConfig.host || 'localhost'
  const PORT = serverConfig.port || 3000

  const app = Express()
  const server = Http.createServer(app)
  const io = new Socket(server, {
    cors: corsConfig,
  })

  const specs = swaggerJSDoc(swaggerOptions)
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

  app.use(helmet())
  // logger
  app.use(
    morgan(loggerConfig.type, {
      stream: loggerConfig.accessLogStream,
    })
  )
  app.use(Express.json())
  app.use(userRoutes)
  app.use(messageRoutes)
  app.use(userStatistics)

  // connect to mongoose
  mongooseConnect();

  app.get('/', (_, res) => {
    return res.send('Author: https://github.com/blvckeasy')
  })

  // --------------------------------------------------------------------------------------------------

  io.use(socketValidateRequest)

  const userStatisticsSocketController = new UserStatisticsSocketController();
  const userSocketController = new UserSocketController();
  const messageSocketController = new MessageSocketController()
  const messageService = new MessageService();
  const userService = new UsersService();


  io.on('connection', async function (socket) {
    const data = await userStatisticsSocketController.userConnected(socket)
    socket.emit('connected', data)
    socket.broadcast.emit('user-connected', data)

    socket.on('disconnect', async function () {
      // in user statistics, switching the user to offline mode
      const disconnect_user = await userStatisticsSocketController.userDisconnected(
        socket
      )
      socket.broadcast.emit('user-disconneted', disconnect_user)
    })
  })

  io.of('/users').use(socketValidateRequest)
  io.of('/users').on('connection', async function (socket) {
    socket.use(socketBodyParser);

    socket.on('get', async function (body) {
      try {
        const id = body?.id

        if (id) {
          const user = await userSocketController.getUser(id)
          return socket.emit('get-user', user)
        }

        const users = await userSocketController.getUsers()
        return socket.emit('get-users', users)
      } catch (error) {
        return socketIOErrorHandler(error, socket)
      }
    })
  })

  io.of('/messages').use(socketValidateRequest)
  io.of('/messages').on('connection', async function (socket) {
    socket.use(socketBodyParser)
    socket.on('post-new-text-message', async function (body) {
      try {
        const { user } = socket;
        const { to_user_id, message } = body;
        if (!(to_user_id && message)) throw new NotFoundException('to_user_id and message is require!');

        const { data: found_user } = await userSocketController.getUser(to_user_id);
        if (!found_user) throw new NotFoundException('user is "to_user_id" not found!');

        const new_message = await messageSocketController.postMessage(socket, body)

        socket.emit('get-new-text-message', new_message);
        return socket.to(found_user?.socket_id).emit('get-new-text-message', new_message);
      } catch (error) {
        return socketIOErrorHandler(error, socket);
      }
    })

    socket.on('patch-edit-message', async function (body) {
      try {
        const { user } = socket;
        const { message_id, message } = body;
        if (!(message_id && message)) throw new NotFoundException("message_id or message is require!");

        const found_message = await messageService.getMessage({ _id: message_id });
        if (!found_message) throw new NotFoundException("message not Found!");

        const friend = await userService.getUser({ _id: found_message.to_user_id });
        if (!friend) throw new NotFoundException("partner user not found!");

        const edited_message = await messageSocketController.editMessage(socket, body);
        
        socket.emit('patch-edited-message', edited_message);
        return socket.to(friend.socket_id).emit('path-edited-message', edited_message);
      } catch (error) {
        return socketIOErrorHandler(error, socket);
      }
    })

    socket.on('delete-message', async function (body) {
      try {
        const { user } = socket;
        const { message_id } = body;

        if (!message_id) throw new NotFoundException("message_id is require!");        

        const deleted_message = await messageSocketController.deleteMessage(socket, body);

        socket.emit('delete-deleted-message', deleted_message);
      } catch (error) {
        console.error(error);
        return socketIOErrorHandler(error, socket);
      }
    })
  })

 
  app.use(errorHandler)
  server.listen(PORT, () => {
    console.log(`🚀 server running on ${serverConfig.url()}`)
  })
}

bootstrap()
