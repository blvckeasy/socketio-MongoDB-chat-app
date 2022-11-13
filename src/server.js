import Http from 'http'
import Express from 'express'
import { Server as Socket } from 'socket.io'
import helmet from 'helmet'
import morgan from 'morgan'
import { mongooseConnect } from './api/database/mongoose.js';
import userRoutes from './api/routes/user.js'
import messageRoutes from './api/routes/message.js'
import { logger } from '../config.js'
import { errorHandler } from './api/middlewares/error.handler.js'
import { socketValidateRequest } from './socket-io/middlewares/validation.js'


async function bootstrap() {
  const HOST = "localhost";
  const PORT = 3000;

  const app = Express()
  const server = Http.createServer(app)
  const io = new Socket(server, {
    cors: {
      origin: '*'
    }
  })
  
  app.use(helmet())
  // logger
  app.use(morgan(logger.type, {
    stream: logger.accessLogStream,
  }))
  app.use(Express.json())
  app.use(userRoutes);
  app.use(messageRoutes)

  // connect to mongoose
  mongooseConnect();

  app.get('/', (req, res) => {
    return res.send('Author: https://github.com/blvckeasy')
  })

  io.use(socketValidateRequest)

  io.on('connection', socket => {
    console.log('connect')
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
    console.log(`server running on http://${HOST}:${PORT}/`)
  })
}

bootstrap();