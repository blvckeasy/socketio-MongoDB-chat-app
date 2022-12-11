import Crypto from "crypto";

export function generateRandomNumber (length = 10) {
  const id = Crypto.randomBytes(length).toString("hex");
  return id;
}