import mongoose from "mongoose";

const instance = mongoose.Schema({
  userId: String,
  username: String,
  picture: String,
});

export default mongoose.model("users", instance);
