import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/auth-context";
import { SocketContextProvider } from "./store/socket-context";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <SocketContextProvider>
    <BrowserRouter>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </SocketContextProvider>,
  document.getElementById("root")
);
