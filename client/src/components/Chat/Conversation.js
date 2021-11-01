import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";

import classes from "./Conversation.module.css";
import axios from "axios";

const Conversation = (props) => {
  const [otherUser, setOtherUser] = useState(null);
  const otherUserId = props.conversation.members.find(
    (user) => user !== props.userId
  );
  useEffect(() => {
    const fetchOtherUser = async (userId) => {
      await axios.get("/api/users/" + userId).then((response) => {
        setOtherUser(response.data);
      });
    };
    fetchOtherUser(otherUserId);
  }, [otherUserId]);

  return (
    <div className={classes.conversation}>
      <Avatar alt={otherUser?.username} src={otherUser?.picture} />
      <span className={classes.conversationName}>{otherUser?.username}</span>
    </div>
  );
};

export default Conversation;
