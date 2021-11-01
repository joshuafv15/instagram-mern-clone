import React, { useState, useEffect, useContext } from "react";

import classes from "./Post.module.css";
import { Avatar, Button } from "@mui/material";
import NewComment from "./NewComment";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import SocketContext from "../../store/socket-context";
import Comment from "./Comment";
import { Link } from "react-router-dom";

function Post(props) {
  const authCtx = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const socket = useContext(SocketContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async (userId) => {
      await axios.get(`/users/${userId}`).then((response) => {
        setUser(response.data);
      });
    };
    fetchUser(props.userId);
  }, [props.userId]);

  useEffect(() => {
    const fetchComments = async () =>
      await axios
        .get(`/posts/syncComments/${props.postId}`)
        .then((response) => {
          setComments(response.data);
        });
    fetchComments();
    socket.on("updateComments", (data) => {
      if (data.comment.postId === props.postId) {
        if (data.type === "add") {
          setComments((prevState) => [...prevState, data.comment]);
        } else if (data.type === "remove") {
          setComments((prevState) =>
            prevState.filter(
              (comment) => comment._id !== data.comment.commentId
            )
          );
        }
      }
    });
  }, [socket, props.postId]);

  const addCommentHandler = async (commentText) => {
    const commentInfo = {
      commentUserId: authCtx.user.uid,
      username: authCtx.username,
      text: commentText,
      postId: props.postId,
    };
    const post = await axios.put(
      `/posts/newComment/${props.postId}`,
      commentInfo
    );
    const comment = post.data.comments[post.data.comments.length - 1];
    socket.emit("newComment", comment);
  };

  const deleteCommentHandler = async (commentId) => {
    await axios.put(`/posts/deleteComment/${props.postId}`, {
      commentId,
    });
    socket.emit("deleteComment", { postId: props.postId, commentId });
  };
  const parentOnDeleteHandler = () => {
    props.onDelete(props.postId);
  };

  return (
    <div className={classes.post}>
      <div className={classes.postHeader}>
        <Link to={`/chat`}>
          <div className={classes.postHeaderUser}>
            <Avatar
              className={classes.postAvatar}
              alt={user?.username}
              src={user?.picture || "./r.png"}
            />
            <h3>{user?.username}</h3>
          </div>
        </Link>
        {authCtx.user?.uid === props.userId && (
          <Button onClick={parentOnDeleteHandler}>Delete Post</Button>
        )}
      </div>

      <img className={classes.postImage} src={props.imageUrl} alt="" />

      <h4 className={classes.postText}>
        <strong>{user?.username}:</strong> {props.caption}
      </h4>

      {comments[0] && (
        <div className={classes.commentsBox}>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={deleteCommentHandler}
            />
          ))}
        </div>
      )}

      {authCtx.user && (
        <div>
          <NewComment postId={props.postId} onAddComment={addCommentHandler} />
        </div>
      )}
    </div>
  );
}

export default Post;
