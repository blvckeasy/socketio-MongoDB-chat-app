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
import { logger as loggerConfig, server as serverConfig, cors as corsConfig, swagger as swaggerOptions } from '../config.js'
import { UserSocketRoute } from './socket-io/routes/user.js';
import { UserStatisticsSocketRoute } from './socket-io/routes/user.statistics.js';
import { MessageSocketRoute } from './socket-io/routes/message.js';


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
  app.use(morgan(loggerConfig.type, loggerConfig.options))
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

  io.on('connection', UserStatisticsSocketRoute)

  io.of('/users').use(socketValidateRequest)
  io.of('/users').on('connection', UserSocketRoute)

  io.of('/messages').use(socketValidateRequest)
  io.of('/messages').on('connection', MessageSocketRoute)


  app.use(errorHandler)
  server.listen(PORT, () => {
    console.log(`🚀 server running on ${serverConfig.url()}`)
  })
}

bootstrap()