import mongoose from "mongoose";

const instance = mongoose.Schema(
  {
    members: [String],
  },
  { timestamps: true }
);

export default mongoose.model("conversations", instance);
