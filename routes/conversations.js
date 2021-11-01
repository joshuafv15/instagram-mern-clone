import express from "express";
import Conversations from "../models/Conversation.js";

const router = express.Router();

router.post("/", (req, res) => {
  Conversations.create(
    {
      members: [req.body.senderId, req.body.receiverId],
    },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

router.get("/getConversationId/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  Conversations.findById(conversationId, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  Conversations.find({ members: userId }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
