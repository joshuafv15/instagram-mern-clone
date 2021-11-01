import React, { useState, useContext } from "react";
import { Button, Input } from "@mui/material";
import classes from "./LoginForm.module.css";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";

const LoginForm = () => {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    authCtx.loginUser(email, password);
    modalCtx.closeLoginModal();
  };
  return (
    <form className={classes.login}>
      <center>
        <img src="./images/instaLogo/logo.png" alt="" />
      </center>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={onSubmitHandler}>Login</Button>
    </form>
  );
};

export default LoginForm;
