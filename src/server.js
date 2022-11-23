import Http from 'http'
import Express from 'express'
import { Server as Socket } from 'socket.io'
import helmet from 'helmet'
import morgan from 'morgan'
import { mongooseConnect } from './api/database/mongoose.js';
import userRoutes from './api/routes/user.js'
import messageRoutes from './api/routes/message.js'
import userStatistics from './api/routes/user.statistics.js';
import { errorHandler } from './api/middlewares/error.handler.js'
import { socketValidateRequest } from './socket-io/middlewares/validation.js'
import { logger as loggerConfig, server as serverConfig, cors as corsConfig } from '../config.js'
import UserSocketController from './socket-io/controllers/user.js';


async function bootstrap() {
  const HOST = serverConfig.host || "localhost";
  const PORT = serverConfig.port || 3000;

  const app = Express()
  const server = Http.createServer(app)
  const io = new Socket(server, {
    cors: corsConfig
  })
  
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

  io.use(socketValidateRequest)

  io.on('connection', async socket => {
    const userSocketController = new UserSocketController()
    socket.emit("connected", userSocketController.userConnected(socket));

    socket.on("islom", (data) => {
      console.log("islom", data);
      return socket.emit("keldi", data);
    })

    
    socket.on("disconnect", () => {
      console.log("disconnect -->")
    })
  })

  app.use(errorHandler);
  server.listen(PORT, () => {
    console.log(`server running on ${serverConfig.url()}`);
  })
}

bootstrap();