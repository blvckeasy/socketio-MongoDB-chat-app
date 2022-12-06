import * as Errors from '../../api/helpers/error.js'


export function socketIOErrorHandler(err, socket) {
  try {
    for (const error in Errors) {
      if (err instanceof Errors[error] || err.name == "ValidationError") {
          return socket.emit("error", JSON.stringify({
            ok: false,  
            error: {
              status: err.status,
              name: err.constructor?.name,
              message: err.message,
            }
          }))
      }
    }

    console.error(err);

    return socket.emit("error", JSON.stringify({
      ok: false,
      error: {
          status: 500, 
          name: "InternalServerError",
          message: "internal server error",
        },
    }))
  } catch (error) {
    console.error(error);
  }
}