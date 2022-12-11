import Http from 'http'
import Express from 'express'
import { Server as Socket } from 'socket.io'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import { mongooseConnect } from './api/database/mongoose.js';
import userRoutes from './api/routes/user.js'
import messageRoutes from './api/routes/message.js'
import userStatistics from './api/routes/user.statistics.js';
import { errorHandler } from './api/middlewares/error.handler.js'
import { socketValidateRequest } from './socket-io/middlewares/validation.js'
import { logger as loggerConfig, server as serverConfig, cors as corsConfig, swagger as swaggerOptions } from '../config.js'
import UserSocketController from './socket-io/controllers/user.js';
import MessageSocketController from './socket-io/controllers/message.js'
import { socketIOErrorHandler } from './socket-io/middlewares/error.handler.js'
import { socketBodyParser } from './socket-io/helpers/json.parser.js'
import { NotFoundException } from './api/helpers/error.js'


async function bootstrap() {
  const HOST = serverConfig.host || "localhost";
  const PORT = serverConfig.port || 3000;

  const app = Express()
  const server = Http.createServer(app)
  const io = new Socket(server, {
    cors: corsConfig,
  })
  
  const specs = swaggerJSDoc(swaggerOptions);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  app.use(helmet())
  // logger
  app.use(morgan(loggerConfig.type, {
    stream: loggerConfig.accessLogStream,
  }))
  app.use(Express.json())
  app.use(userRoutes);
  app.use(messageRoutes);
  app.use(userStatistics);

  // connect to mongoose
  mongooseConnect();

  app.get('/', (_, res) => {
    return res.send('Author: https://github.com/blvckeasy')
  })

  // --------------------------------------------------------------------------------------------------

  io.use(socketValidateRequest);

  const userSocketController = new UserSocketController();
  const messageSocketController = new MessageSocketController();

  io.on("connection", async function (socket) {
    const data = await userSocketController.userConnected(socket);
    socket.emit("connected", data);
    socket.broadcast.emit("user-connected", data);

    socket.on("disconnect", async function () {
      // in user statistics, switching the user to offline mode
      const disconnect_user = await userSocketController.userDisconnected(socket);
      socket.broadcast.emit("user-disconneted", disconnect_user);
    })
  });
  
  io.of("/users").on("connection", async function (socket) {
    socket.on("get", async function (body) {
      try {
        body = socketBodyParser(body);
        const id = body.id;
        console.log("idd ", id);

        if (id) {
          const user = await userSocketController.getUser(id);
          return socket.emit("get-user", user);
        }

        const users = await userSocketController.getUsers();
        return socket.emit("get-users", users);
      } catch (error) {
        return socketIOErrorHandler(error, socket);
      }
    })
  })

  io.of("/messages").on("connection", async function (socket) {
    console.log(socket.to);

    socket.on("new-message", async function (body) {
      try {
        body = socketBodyParser(body);
        const { user } = socket;
        const { to_user_id, message } = body;

        if (!(user && to_user_id && message)) throw new NotFoundException("to_user_id and message is require!");

        const new_message = messageSocketController.postMessage(socket, body);
        
        // return socket.so
      } catch (error) {
        return socketIOErrorHandler(error, socket);
      }
    })
  })

  // io.use(socketValidateRequest)
  // io.on('connection', async socket => {

  //   console.log(socket.request.headers['user-agent']);
  //   // return 0;


  //   const userSocketController = new UserSocketController()
  //   socket.emit("connected", await userSocketController.userConnected(socket));

  //   socket.use((event, next) => {
      
  //     // console.log(event[0]);
  //     // console.log(event[1]);
  //     // console.log(JSON.parse(event[1]));
  //     // console.log(typeof(JSON.parse(event[1])));
  //     next();
  //   });

  //   socket.on("message", (data) => {
  //     console.log("message", data);
  //     // return socket.emit("keldi", data);
  //   })

    
  //   socket.on("disconnect", () => {
  //     console.log("disconnect -->")
  //   })
  // })

  // --------------------------------------------------------------------------------------------------

  app.use(errorHandler);
  server.listen(PORT, () => {
    console.log(`🚀 server running on ${serverConfig.url()}`);
  })
}

bootstrap();