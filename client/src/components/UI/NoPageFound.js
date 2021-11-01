import React from "react";
import classes from "./NoPageFound.module.css";

function NoPageFound() {
  return (
    <div className={classes.page}>
      <h2 className={classes.text}>
        The page you're trying to reach doesn't exist. Sorry
      </h2>
    </div>
  );
}

export default NoPageFound;
