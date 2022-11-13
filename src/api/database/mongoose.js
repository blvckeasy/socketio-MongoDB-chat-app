import mongoose from "mongoose";
import { database } from "../../../config.js";

export async function mongooseConnect() {
  try {
    const DB = mongoose.connection;
    const url = database.url;
    const config = {
      useNewUrlParser: true,
    };

    DB
      .on("open", () => console.log("You are connected to Mongo."))
      .on("close", () => console.log("You are   disconnected to Mongo."))
      .on("error", (err) => console.error("somethig wrong .-_-.", err))

    await mongoose.connect(url, config)
    return true;
  } catch (error) {
    throw new Error(error);
  }
}