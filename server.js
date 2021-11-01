import express from "express";
import mongoose from "mongoose";
import postRoute from "./routes/posts.js";
import conversationRoute from "./routes/conversations.js";
import userRoute from "./routes/users.js";
import messageRoute from "./routes/messages.js";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// app config
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
dotenv.config();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("A user connected");
  console.log(socket.id);

  socket.on("login", (userId) => {
    console.log("user logged in");
    console.log(userId, socket.id, "here");
    users[userId] = socket.id;
    console.log(users);
  });
  socket.on("newConvo", (data) => {
    if (users[data.userId]) {
      io.to(users[data.userId]).emit("updateConversations", data.newConvo);
    }
  });

  socket.on("newMessage", (data) => {
    const message = { ...data.message, _id: data._id };
    io.to(users[data.receiverId]).emit("updateMessages", message);
  });
  socket.on("newPost", (post) => {
    const data = { type: "add", post };
    io.emit("updatePosts", data);
  });
  socket.on("deletePost", (postId) => {
    const data = { type: "remove", postId };
    io.emit("updatePosts", data);
  });

  socket.on("newComment", (comment) => {
    const data = { type: "add", comment };
    io.emit("updateComments", data);
  });
  socket.on("deleteComment", (comment) => {
    const data = { type: "remove", comment };
    io.emit("updateComments", data);
  });
  socket.on("logout", (userId) => {
    delete users[userId];
  });
  socket.on("disconnect", () => {
    for (let user in users) {
      if (users[user] === socket.id) {
        delete users[user];
      }
    }
  });
});

const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

//DB config
const connection_url = process.env.DB_URL;
mongoose.connect(connection_url);

mongoose.connection.once("open", () => {
  console.log("DB Connected");
});

// api routes
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);

if (process.env.NODE_ENV === "production") {
  // Exprees will serve up production assets
  app.use(express.static("client/build"));
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Express serve up index.html file if it doesn't recognize route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// listen
httpServer.listen(port, () => console.log(`listening on localhost:${port}`));
