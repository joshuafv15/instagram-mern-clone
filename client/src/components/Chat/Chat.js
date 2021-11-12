import React, { useEffect, useContext, useState, useRef } from "react";

import classes from "./Chat.module.css";
import Conversation from "./Conversation";
import User from "./User";
import Message from "./Message";
import { Button } from "@mui/material";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import SocketContext from "../../store/socket-context";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const authCtx = useContext(AuthContext);
  const scrollRef = useRef();
  const socket = useContext(SocketContext);

  //Get all the conversations for this user
  useEffect(() => {
    const fetchConversations = async (userId) => {
      await axios.get("/api/conversations/" + userId).then((response) => {
        setConversations(response.data);
      });
    };
    fetchConversations(authCtx.user.uid);

    socket?.emit("addUser", authCtx.user.uid);
    socket?.on("updateConversations", (data) => {
      setConversations((prevState) => [...prevState, data]);
    });
  }, [authCtx.user.uid, socket]);

  useEffect(() => {
    const fetchOtherUser = async (conversationId) => {
      const receiverId = await axios
        .get("/api/conversations/getConversationId/" + conversationId)
        .then((response) => {
          return response.data.members.find(
            (user) => user !== authCtx.user.uid
          );
        });
      await axios.get("/api/users/" + receiverId).then((response) => {
        setOtherUser(response.data);
      });
    };
    if (currentChat) {
      fetchOtherUser(currentChat);
    }
  }, [currentChat, authCtx.user.uid]);

  useEffect(() => {
    const fetchMessages = async (conversationId) => {
      await axios.get("/api/messages/" + conversationId).then((response) => {
        setMessages(response.data);
      });
    };
    fetchMessages(currentChat);
    socket.on("updateMessages", (message) => {
      if (message.conversationId === currentChat) {
        setMessages((prevState) => [...prevState, message]);
      }
    });

    return () => socket.removeAllListeners("updateMessages");
  }, [currentChat, socket, authCtx.user.uid]);

  useEffect(() => {
    const fetchUsers = async () => {
      await axios.get("/api/users/").then((response) => {
        const otherUsers = response.data.filter(
          (user) => user.userId !== authCtx.user.uid
        );
        setUsers(otherUsers);
      });
    };
    fetchUsers();
  }, [authCtx.user.uid]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      conversationId: currentChat,
      sender: authCtx.user.uid,
      text: newMessage,
    };
    let newMessageId = "";
    await axios.post("/api/messages/", message).then((response) => {
      newMessageId = response.data._id;
      setMessages((prevState) => [...prevState, response.data]);
    });
    const receiverId = await axios
      .get("/api/conversations/getConversationId/" + message.conversationId)
      .then((response) => {
        return response.data.members.find((user) => user !== message.sender);
      });
    const data = {
      message,
      receiverId,
      _id: newMessageId,
    };
    socket?.emit("newMessage", data);
    setNewMessage("");
  };

  const openConversationHandler = async (user) => {
    const conversationFound = conversations.find((conversation) =>
      conversation.members.includes(user.userId)
    );
    const conversationId = conversationFound?._id;
    if (conversationId) {
      setCurrentChat(conversationId);
    } else {
      //post new conversation
      const newConvo = await axios.post("/api/conversations/", {
        senderId: authCtx.user.uid,
        receiverId: user.userId,
      });
      setConversations((prevState) => [...prevState, newConvo.data]);
      setCurrentChat(newConvo.data._id);
      socket.emit("newConvo", { newConvo: newConvo.data, userId: user.userId });
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={classes.messenger}>
      <div className={classes.chatMenu}>
        <div className={classes.chatMenuWrapper}>
          {conversations.map((conversation) => (
            <div
              onClick={() => setCurrentChat(conversation._id)}
              key={conversation._id}
              className={
                currentChat === conversation._id
                  ? classes.activeConversation
                  : undefined
              }
            >
              <Conversation
                conversation={conversation}
                userId={authCtx.user.uid}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={classes.chatBox}>
        <div className={classes.chatBoxWrapper}>
          <div className={classes.chatBoxTop}>
            {!currentChat ? (
              <span className={classes.noConversation}>
                Click a conversation to start Chatting
              </span>
            ) : (
              messages?.map((message) => (
                <div key={message._id} ref={scrollRef}>
                  <Message
                    user={otherUser}
                    message={message}
                    own={message.sender === authCtx.user.uid}
                  />
                </div>
              ))
            )}
          </div>
          <form onSubmit={sendMessageHandler} className={classes.chatBoxBottom}>
            <input
              type="text"
              className={classes.chatMessageInput}
              placeholder="Write something..."
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              value={newMessage}
            ></input>
            <Button
              className={classes.chatSubmitButton}
              disabled={!currentChat}
              type="submit"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
      <div className={classes.chatUsers}>
        <div className={classes.chatUsersWrapper}>
          <h4 className={classes.newChatTitle}>Start New Chat</h4>
          <input
            placeholder="Search for friends..."
            className={classes.chatUsersInput}
          />
          {users.map((user) => (
            <div
              key={user.userId}
              data-value={user}
              onClick={openConversationHandler.bind(this, user)}
            >
              <User
                userId={user.userId}
                username={user.username}
                picture={user.picture}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
