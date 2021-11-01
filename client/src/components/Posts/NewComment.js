import React, { useState } from "react";
import classes from "./NewComment.module.css";

function NewComment(props) {
  const [comment, setComment] = useState("");

  const postCommentHandler = (event) => {
    event.preventDefault();
    props.onAddComment(comment);
    setComment("");
  };
  return (
    <form onSubmit={postCommentHandler} className={classes.form}>
      <input
        className={classes.formInput}
        type="text"
        placeholder="Insert a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className={classes.formButton} type="submit" disabled={!comment}>
        Post
      </button>
    </form>
  );
}

export default NewComment;
