import express from "express";
import Messages from "../models/Message.js";

const router = express.Router();

router.post("/", (req, res) => {
  const message = req.body;
  Messages.create(message, (err, data) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

router.get("/:conversationId", (req, res) => {
  const conversationId = req.params.conversationId;
  Messages.find({ conversationId: conversationId }, (err, data) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

export default router;
