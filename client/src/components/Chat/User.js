import React from "react";
import { Avatar } from "@mui/material";

import classes from "./User.module.css";

const User = (props) => {
  return (
    <div className={classes.user}>
      <Avatar alt={props.username} src={props.picture} />
      <span className={classes.username}>{props.username}</span>
    </div>
  );
};

export default User;
