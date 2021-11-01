import mongoose from "mongoose";

const instance = mongoose.Schema(
  {
    caption: String,
    user: String,
    image: String,
    userId: String,
    comments: [
      {
        commentUserId: String,
        username: String,
        text: String,
        postId: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("posts", instance);
