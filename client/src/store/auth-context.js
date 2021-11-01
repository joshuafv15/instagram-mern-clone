import React from "react";

import { useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import SocketContext from "./socket-context";

const AuthContext = React.createContext({
  user: null,
  username: null,
  picture: null,
  updatePicture: () => {},
  signupUser: () => {},
  loginUser: () => {},
  onLogout: () => {},
});

export const AuthContextProvider = (props) => {
  const socket = useContext(SocketContext);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    const fetchUser = async (userId) => {
      await axios.get(`/api/users/${userId}`).then((response) => {
        setPicture(response.data.picture);
      });
    };
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUser(authUser.uid);
        socket.emit("login", authUser.uid);
        setUsername(authUser.displayName);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [socket]);

  const signupHandler = async (username, email, password) => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        setUsername(username);
        axios.post("/api/users/", {
          userId: userCredential.user.uid,
          username: username,
        });
        return updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setUsername(username);
  };

  const loginHandler = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then()
      .catch((error) => alert(error.message));
  };

  const logoutHandler = async () => {
    socket.emit("logout", user.uid);
    setUser(null);
    setUsername(null);
    await signOut(auth);
  };

  const updatePictureHandler = (picture) => {
    setPicture(picture);
  };
  return (
    <AuthContext.Provider
      value={{
        signupUser: signupHandler,
        loginUser: loginHandler,
        onLogout: logoutHandler,
        updatePicture: updatePictureHandler,
        user: user,
        username: username,
        picture: picture,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
