import React, { useContext } from "react";
import BasicModal from "../UI/BasicModal";
import classes from "./Header.module.css";
import SignupForm from "../Auth/SignupForm";
import LoginForm from "../Auth/LoginForm";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import NewPictureForm from "./NewPictureForm";

function Header() {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);

  return (
    <div className={classes.header}>
      <Link to="/home">
        <img
          alt=""
          className={classes.headerImage}
          src="./images/instaLogo/logo.png"
        />
      </Link>
      {!authCtx.user && (
        <div className={classes.buttons}>
          <BasicModal
            button="Login"
            openModal={modalCtx.openLoginModal}
            modalIsOpen={modalCtx.loginModalIsOpen}
            closeModal={modalCtx.closeLoginModal}
          >
            <LoginForm />
          </BasicModal>
          <BasicModal
            button="Signup"
            openModal={modalCtx.openSignupModal}
            modalIsOpen={modalCtx.signupModalIsOpen}
            closeModal={modalCtx.closeSignupModal}
          >
            <SignupForm />
          </BasicModal>
        </div>
      )}
      {authCtx.user && (
        <div className={classes.buttons}>
          <Link to="/chat">
            <Button>Chat</Button>
          </Link>
          <BasicModal
            button={authCtx.username}
            openModal={modalCtx.openProfileModal}
            modalIsOpen={modalCtx.profileModalIsOpen}
            closeModal={modalCtx.closeProfileModal}
          >
            <NewPictureForm />
          </BasicModal>
          <Link to="/home">
            <Button onClick={authCtx.onLogout}>Logout</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
