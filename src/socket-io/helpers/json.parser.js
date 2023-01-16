import { InvalidDataException } from "../../api/helpers/error.js";

export function socketBodyParser(event, next) {
  try {
    if (typeof event[1] === "object") {
      return next();
    }

    if (typeof event[1] === "string") {
      event[1] = JSON.parse(event[1]);
      return next()
    }

    return next()
    // throw new InvalidDataException("Invalid data!");
  } catch (error) {
    if (error instanceof InvalidDataException) {
      throw new InvalidDataException(error);
    } else {
      throw new InvalidDataException("The body must be in JSON format");
    }
  }
}