import Dotenv from 'dotenv';
import Fs from 'fs'
import Path from 'path'
import { getCurrentDate } from './src/api/helpers/date.js'

Dotenv.config();


export const server = {
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 3000,
  url: function () {
    return `http${this.host != "localhost" ? "s" : ""}://${this.host}:${this.port}`
  },
}

export const cors = {
  allow_origin: process.env.ALLOW_ORIGIN || "*",
  allow_headers: process.env.ALLOW_HEADERS || "*",
  allow_methods: process.env.ALLOW_METHODS || "OPTIONS, GET, POST, PUT, DELETE",
  request_method: process.env.REQUEST_METHOD || "*",
};

export const database = {
  url: process.env.DB_URL,
  config: {
    useNewUrlParser: true,
  }
}

export const logger = {
  type: 'combined',
  options: {
    stream: Fs.createWriteStream(Path.join(process.cwd(), 'src', 'api', 'logs', 'requests', `${getCurrentDate()}.log`), { flags: "a" }),
  }
}

export const pagination = {
  limit: process.env.PAGINATION_LIMIT || 10,
  page: process.env.PAGINATION_PAGE || 0,
}

// login and password required to clear data before releasing the project to production default login: "admin", password: "admin"
export const admin = {
  login: process.env.LOGIN || "admin",
  password: process.env.PASSWORD || "admin",
  /**
   * @param login @param password
   * @return password are entered correctly, otherwise false.
   */
  check(login, password) {
    if (login === this.login && password === this.password) return true;
    return false;
  }
}

export const JWT = {
  secretOrPrivateKey: process.env.JWT_SECRET_KEY || "863d909f8f105c7c4b14ce6ffec47e98d64d143c93024bb5f48e8f2c3ec452c2",
  options: {
    algorithm: process.env.JWT_ALGORITHM || "RS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  }
}

export const swagger = {
  definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: server.url(),
			},
		],
	},
  apis: ["./src/api/routes/*.js"]
}
