import mongoose, { Schema } from "mongoose";
import UUID from "node-uuid";

const UsersStatisticsSchema = new Schema({
  _id: {
    type: String,
    default: UUID.v1,
  },

  user_id: {
    type: String,
    required: true,
    ref: "Users"
  },

  SignIn_time: {
    type: Date,
    default: Date.now,
  },

  Exit_time: {
    type: Date,
    default: null, 
  },
})


export default mongoose.model("Userstatistics", UsersStatisticsSchema);