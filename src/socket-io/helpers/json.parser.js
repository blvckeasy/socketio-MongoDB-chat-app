import { InvalidDataException } from "../../api/helpers/error.js";

export function socketBodyParser(event, next) {
  try {
    if (typeof event[1] === "object") {
      return next();
    }

    event[1] = JSON.parse(event[1]);
    next();
  } catch (error) {
    throw new InvalidDataException("The body must be in JSON format");
  }
}