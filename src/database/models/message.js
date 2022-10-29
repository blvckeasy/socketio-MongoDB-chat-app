import mongoose, { Schema, Types } from "mongoose";
import UUID from "node-uuid";


const MessageSchema = new Schema({
  _id: {
    type: String,
    default: UUID.v4(),
  },

  user_id: {
    type: Types.ObjectId,
    ref: "Users"
  },

  message: {
    type: String,
    min: 1,
    max: 500
  },
})


export default mongoose.model("Messages", MessageSchema)