import mongoose, { Schema, Types } from "mongoose";
import UUID from "node-uuid";


const MessageSchema = new Schema({
  _id: {
    type: String,
    default: UUID.v1,
  },

  from_user_id: {
    type: String,
    ref: "Users"
  },

  to_user_id: {
    type: String,
    ref: "Users"
  },

  message: {
    type: String,
    min: 1,
    max: 500
  },

  sended_time: {
    type: Date,
    default: +new Date() + 7 * 24 * 60 * 60 * 1000,
  }
})


export default mongoose.model("Messages", MessageSchema)