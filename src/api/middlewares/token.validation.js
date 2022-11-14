import { ForbiddenError, UnAuthorizationError } from "../helpers/error.js"
import { verifyToken } from "../helpers/jwt.js"

export async function tokenValidation(req, res, next) {
  try {
    const token= req.headers["authorization"]?.split(" ")[1] || req.body?.token;  
    if (!token) throw new UnAuthorizationError("token is not defined");

    const user = verifyToken(token);
    const userAgent = req.headers['user-agent'];

    if (user["user-agent"] !== userAgent) throw new ForbiddenError("invalid token");

    next();
  } catch (error) {
    next(error);
  }
}