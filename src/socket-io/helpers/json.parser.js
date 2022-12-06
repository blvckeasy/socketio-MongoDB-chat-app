import { InvalidDataException } from "../../api/helpers/error.js";

export function socketBodyParser(body) {
  try {
    if (typeof body === "object") {
      return body;
    }

    return JSON.parse(body);
  } catch (error) {
    throw new InvalidDataException("The body must be in JSON format");
  }
}