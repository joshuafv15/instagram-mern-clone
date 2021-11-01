import { Button } from "@mui/material";
import React, { useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./Comment.module.css";

const Comment = (props) => {
  const authCtx = useContext(AuthContext);
  const deleteCommentHandler = () => {
    props.onDelete(props.comment._id);
  };
  return (
    <div>
      <div className={classes.comment} key={props.comment._id}>
        <p>
          <strong>{props.comment.username}: </strong>
          {props.comment.text}
        </p>
        {authCtx.user?.uid === props.comment.commentUserId && (
          <Button onClick={deleteCommentHandler}>x</Button>
        )}
      </div>
    </div>
  );
};

export default Comment;
