import * as Errors from '../helpers/error.js'
import { AppendErrorToFile } from '../helpers/file.js'

export function errorHandler(err, req, res, next) {
  try {
    for (const error in Errors) {
      if (err instanceof Errors[error] || err.name == "ValidationError") {
          return res.status(400).send({
            ok: false,
            error: err,
          })
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

    console.error(err);
    
    AppendErrorToFile(error);
  } catch (error) {
    console.error(error)
  }
  return res.send(JSON.stringify({
    ok: false,
    message: "internal server error",
  })).status(500);
}