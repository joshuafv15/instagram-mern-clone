import mongoose from "mongoose";

const instance = mongoose.Schema(
  {
    conversationId: String,
    sender: String,
    text: String,
  },
  { timestamps: true }
);

export default mongoose.model("messages", instance);
