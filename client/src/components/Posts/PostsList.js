import React from "react";
import Post from "./Post";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SocketContext from "../../store/socket-context";

import classes from "./PostsList.module.css";

function PostsList() {
  const [posts, setPosts] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchPosts = async () => {
      await axios.get("/api/posts/sync").then((response) => {
        setPosts(response.data);
      });
    };
    fetchPosts();
    socket.on("updatePosts", (data) => {
      if (data.type === "add") {
        setPosts((prevState) => [data.post, ...prevState]);
      } else if (data.type === "remove") {
        setPosts((prevState) =>
          prevState.filter((post) => post._id !== data.postId)
        );
      }
    });
  }, [socket]);

  const deletePostHandler = async (postId) => {
    await axios.delete(`/api/posts/deletePost/${postId}`);
    socket.emit("deletePost", postId);
  };
  return (
    <div className={classes.posts}>
      <ul>
        {posts.map((post) => (
          <Post
            key={post._id}
            postId={post._id}
            caption={post.caption}
            imageUrl={post.image}
            userId={post.userId}
            onDelete={deletePostHandler}
          />
        ))}
      </ul>
    </div>
  );
}

export default PostsList;
