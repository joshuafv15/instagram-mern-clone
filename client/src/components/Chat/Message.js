import React from "react";
import { Avatar } from "@mui/material";
import { format } from "timeago.js";

import classes from "./Message.module.css";
const Message = (props) => {
  return (
    <div
      className={`${classes.message} ${props.own ? classes.own : classes.sent}`}
    >
      <div className={classes.messageTop}>
        {!props.own && (
          <Avatar
            alt={props.user?.username}
            src={props.user?.picture || "./1.jpg"}
          />
        )}
        <p className={classes.messageText}>{props.message.text}</p>
      </div>
      <div className={classes.messageBottom}>
        {format(props.message.createdAt)}
      </div>
    </div>
  );
};

export default Message;
