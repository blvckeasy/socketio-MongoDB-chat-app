import JWT from "jsonwebtoken";
import { JWT as jwt_config } from "../../config.js";
import { AuthenticationError } from "./error.js";

export function signToken (payload) {
  try {
    const token = JWT.sign(payload, jwt_config.secretOrPrivateKey, jwt_config.options);
    return token;
  } catch (error) {
    throw new Error(error);
  }
}

export function verifyToken (token) {
  try {
    const data = JWT.verify(token, jwt_config.secretOrPrivateKey);
    return data;
  } catch (error) {
    throw new AuthenticationError(error);
  }
}