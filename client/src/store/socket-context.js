import { io } from "socket.io-client";
import React from "react";

const SocketContext = React.createContext();

export const SocketContextProvider = (props) => {
  const socket = io("ws://localhost:4000");

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
