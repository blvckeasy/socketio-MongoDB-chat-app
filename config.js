import Dotenv from 'dotenv';
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