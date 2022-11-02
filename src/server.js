import Http from 'http'
import Express from 'express'
import { Server as Socket } from 'socket.io'
import helmet from 'helmet'
import morgan from 'morgan'
import { mongooseConnect } from './database/mongoose.js';
import userRoutes from './routes/user.js'
import messageRoutes from './routes/message.js'
import { logger } from '../config.js'

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
  app.use(morgan('combined', {
    stream: logger.accessLogStream
  }))
  app.use(Express.json())
  app.use(userRoutes);
  app.use(messageRoutes)

  // connect to mongoose
  mongooseConnect();

  app.get('/', (req, res) => {
    return res.send('hello')
  })

  io.use((socket, next) => {
    const key = socket.handshake;
    console.log(key)
    next();
  })

  io.on('connection', socket => {
    console.log('connect')
    socket.on("message", (data) => {
      console.log('ok')
      socket.emit("get", "hello world");
    })

    socket.on("disconnect", () => {
      console.log("disconnect -->")
    })
  })


  server.listen(PORT, () => {
    console.log(`server running on http://${HOST}:${PORT}/`)
  })

}

bootstrap();