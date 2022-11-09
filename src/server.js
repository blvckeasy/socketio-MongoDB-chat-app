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
import { AppendErrorToFile } from './helpers/file.js'


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
    return res.send('hello')
  })

  io.use((socket, next) => {
    const key = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) {
      return socket.emit("error", );
    } 
    console.log(key)
    next();
  })

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

  app.use((err, req, res, next) => {
    try {
      for (const error in Errors) {
        if (err instanceof Errors[error]) {
            return res.status(400).send({
              ok: false,
              error: err,
            })
        }
      }
  
      const error = {
        error: err,
        info: {
          method: req.method,
          url: req.url,
          ip: req?.headers['x-forwarded-for'] || req.socket.remoteAddress,
          date: new Date(),
        },
      }
      
      AppendErrorToFile(error);
    } catch (error) {
      console.error(error);
    }
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