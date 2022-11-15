import JWT from "jsonwebtoken";
import { JWT as jwt_config } from "../../../config.js";
import { AuthenticationError } from "./error.js";


// export async function signToken (payload) {
//   try {

//     // if (typeof payload === "object") {
//     //   payload = JSON.parse(JSON.stringify(payload));
//     // }

//     console.log('secretKey:', jwt_config.secretOrPrivateKey);
//     console.log('expiresIn:', jwt_config.options.expiresIn);
//     console.log('algorithm:', jwt_config.options.algorithm);
//     console.log('payload:', payload);

//     const token = JWT.sign({ a: 1}, jwt_config.secretOrPrivateKey,  jwt_config.options);
//     return token;
//   } catch (error) {
//     console.log(error.message);
//     console.error(error);
//     throw error;
//   }
// }

// export function verifyToken (token) {
//   try {
//     const data = JWT.verify(token, jwt_config.secretOrPrivateKey);
//     return data;
//   } catch (error) {
//     throw new AuthenticationError(error);
//   }
// }


export function signToken (payload) {
  return JWT.sign(payload, jwt_config.secretOrPrivateKey, { expiresIn: jwt_config.options.expiresIn })
}

export function verifyToken (token) {
  return JWT.verify(token, jwt_config.secretOrPrivateKey);
}
