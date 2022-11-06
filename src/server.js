import Http from 'http'
import Express from 'express'
import { Server as Socket } from 'socket.io'
import helmet from 'helmet'
import morgan from 'morgan'
import { mongooseConnect } from './database/mongoose.js';
import userRoutes from './routes/user.js'
import messageRoutes from './routes/message.js'
import { logger } from '../config.js'
import * as Errors from './helpers/error.js'


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

  app.use((err, req, res, next) => {
    const ALL_CUSTOM_ERROR_NAMES = Object.keys(Errors);

    for (const error in Errors) {
      if (err instanceof Errors[error]) {
          return res.send({
            status: 500,
            ok: false,
            error: err,
          }).status(500)
      }
    }

    console.log("internal server error", err);

    return res.send({
      ok: false,
      message: "internal server error",
    }).status(505)
  })

  server.listen(PORT, () => {
    console.log(`server running on http://${HOST}:${PORT}/`)
  })

}

bootstrap();