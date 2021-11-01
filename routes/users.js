import express from "express";
import Users from "../models/Users.js";

const router = express.Router();
router.put("/", (req, res) => {
  const newPicture = req.body;
  console.log("hello");
  Users.findOneAndUpdate(
    { userId: newPicture.userId },
    { $set: { picture: newPicture.image } },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    }
  );
});

router.post("/", (req, res) => {
  const newUser = {
    username: req.body.username,
    userId: req.body.userId,
  };
  Users.create(newUser, (err, data) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  Users.findOne({ userId: userId }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get("/", (req, res) => {
  Users.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
