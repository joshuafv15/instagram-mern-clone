import React, { useState, useContext } from "react";
import { Button, Input } from "@mui/material";
import classes from "./SignupForm.module.css";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";

const SignupForm = () => {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    authCtx.signupUser(username, email, password);
    modalCtx.closeSignupModal();
  };
  return (
    <form className={classes.signup}>
      <center>
        <img src="./images/instaLogo/logo.png" alt="" />
      </center>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button onClick={onSubmitHandler}>SignUp</Button>
    </form>
  );
};

export default SignupForm;
