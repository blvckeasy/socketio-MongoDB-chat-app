import JWT from "jsonwebtoken";
import { JWT as jwt_config } from "../../../config.js";


export function signToken (payload) {
  try {
    payload = JSON.parse(JSON.stringify(payload));
    return JWT.sign(payload, jwt_config.secretOrPrivateKey, { expiresIn: jwt_config.options.expiresIn })
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function verifyToken (token) {
  return JWT.verify(token, jwt_config.secretOrPrivateKey);
}
