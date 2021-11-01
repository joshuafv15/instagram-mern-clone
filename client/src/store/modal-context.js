import React from "react";

import { useState } from "react";

const ModalContext = React.createContext({
  loginModalIsOpen: false,
  profileModalIsOpen: false,
  signupModalIsOpen: false,
  openLoginModal: () => {},
  openProfileModal: () => {},
  openSignupModal: () => {},
  closeLoginModal: () => {},
  closeProfileModal: () => {},
  closeSignupModal: () => {},
});

export const ModalContextProvider = (props) => {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
  const [profileModalIsOpen, setProfileModalIsOpen] = useState(false);

  const openLoginModalHandler = () => {
    setLoginModalIsOpen(true);
  };

  const closeLoginModalHandler = () => {
    setLoginModalIsOpen(false);
  };
  const openSignupModalHandler = () => {
    setSignupModalIsOpen(true);
  };

  const closeSignupModalHandler = () => {
    setSignupModalIsOpen(false);
  };

  const openProfileModalHandler = () => {
    setProfileModalIsOpen(true);
  };

  const closeProfileModalHandler = () => {
    setProfileModalIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        loginModalIsOpen: loginModalIsOpen,
        openLoginModal: openLoginModalHandler,
        closeLoginModal: closeLoginModalHandler,
        signupModalIsOpen: signupModalIsOpen,
        openSignupModal: openSignupModalHandler,
        closeSignupModal: closeSignupModalHandler,
        profileModalIsOpen: profileModalIsOpen,
        openProfileModal: openProfileModalHandler,
        closeProfileModal: closeProfileModalHandler,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
