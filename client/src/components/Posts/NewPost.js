import React, { useState, useContext } from "react";

import { Button } from "@mui/material";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import AuthContext from "../../store/auth-context";
import SocketContext from "../../store/socket-context";
import axios from "axios";

import classes from "./NewPost.module.css";
function NewPost() {
  const authCtx = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const fileSelectHandler = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const uploadHandler = () => {
    const uploadTask = uploadBytesResumable(
      ref(storage, `images/${image.name}`),
      image
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
        getDownloadURL(ref(storage, `images/${image.name}`)).then(
          async (url) => {
            const post = await axios.post("/posts/upload", {
              caption: caption,
              image: url,
              user: authCtx.username,
              userId: authCtx.user.uid,
            });
            socket.emit("newPost", post.data);
            setProgress(0);
            setCaption("");
            setImage(null);
          }
        );
      }
    );
  };
  return (
    <div className={classes.imageUpload}>
      <progress className={classes.progress} value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input
        type="file"
        className={classes.fileUploader}
        onChange={fileSelectHandler}
      />
      <Button onClick={uploadHandler} disabled={!(image && caption)}>
        Upload
      </Button>
    </div>
  );
}

export default NewPost;
