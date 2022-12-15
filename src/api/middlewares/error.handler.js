import * as Errors from '../helpers/error.js'
import { AppendErrorToFile } from '../helpers/file.js'

export function errorHandler(err, req, res, next) {
  try {
    for (const error in Errors) {
      if ((err instanceof Errors[error] || err.name == "ValidationError") && !(err instanceof Errors.InternalServerError)) {
          return res.status(400).send(JSON.stringify({
            ok: false,  
            error: {
              status: err.status,
              name: err.constructor?.name,
              message: err.message,
            }
          }))
      }
    }
    
    const error = {
      error: String(err),
      info: {
        method: req.method,
        url: req.url,
        ip: req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress,
        body: req?.body,
        date: new Date(),
      },
    }

    // for me
    console.error(err);
    
    AppendErrorToFile(error);
  } catch (error) {
    console.error(error)
  }
  return res.send(JSON.stringify({
    ok: false,
    error: {
      status: 500, 
      name: "InternalServerError",
      message: "internal server error",
    },
  })).status(500);
}