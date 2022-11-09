import Dotenv from 'dotenv';
import Fs from 'fs'
import Path from 'path'
import { getCurrentDate } from './src/api/helpers/date.js'

Dotenv.config();

export const server = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
}

export const cors = {
  allow_origin: process.env.ALLOW_ORIGIN || "*",
  allow_headers: process.env.ALLOW_HEADERS || "*",
  allow_methods: process.env.ALLOW_METHODS || "OPTIONS, GET, POST, PUT, DELETE",
  request_method: process.env.REQUEST_METHOD || "*",
};

export const database = {
  url: process.env.DB_URL
}

export const logger = {
  type: 'combined',
  accessLogStream: Fs.createWriteStream(Path.join(process.cwd(), 'src', 'api', 'logs', 'requests', `${getCurrentDate()}.log`), { flags: "a" })
}

export const JWT = {
  secretOrPrivateKey: process.env.JWT_SECRET_KEY || "863d909f8f105c7c4b14ce6ffec47e98d64d143c93024bb5f48e8f2c3ec452c2",
  options: {
    algorithm: process.env.JWT_ALGORITHM || "SHA256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  }
}