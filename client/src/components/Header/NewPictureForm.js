import React, { useState, useContext } from "react";
import { Button, Avatar } from "@mui/material";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import classes from "./NewPictureForm.module.css";
import axios from "axios";

const NewPictureForm = () => {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);
  const [picture, setPicture] = useState(null);
  const [progress, setProgress] = useState(0);

  const fileSelectHandler = (event) => {
    if (event.target.files[0]) {
      setPicture(event.target.files[0]);
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const uploadTask = uploadBytesResumable(
      ref(storage, `profilePics/${picture.name}`),
      picture
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const currentProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(currentProgress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        getDownloadURL(ref(storage, `profilePics/${picture.name}`)).then(
          async (url) => {
            await axios.put("/api/users/", {
              userId: authCtx.user.uid,
              image: url,
            });
            authCtx.updatePicture(url);
            setPicture(null);
            modalCtx.closeProfileModal();
          }
        );
      }
    );
  };
  return (
    <form className={classes.form}>
      <Avatar
        alt={authCtx.username}
        src={authCtx.picture || "./images/avatar/noAvatar.png"}
        sx={{ width: 200, height: 200 }}
      />

      <progress className={classes.progress} value={progress} max="100" />
      <input type="file" onChange={fileSelectHandler} />
      <Button onClick={onSubmitHandler} disabled={!picture}>
        Update Picture
      </Button>
    </form>
  );
};

export default NewPictureForm;
