import express from "express";
import Posts from "../models/Posts.js";

const router = express.Router();

router.get("/sync", (req, res) => {
  Posts.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  }).sort({ createdAt: "desc" });
});
router.get("/syncComments/:postId", (req, res) => {
  const postId = req.params.postId;
  Posts.findById(postId, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data.comments);
    }
  });
});

router.post("/upload", (req, res) => {
  const body = req.body;
  Posts.create(body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

router.put("/newComment/:postId", (req, res) => {
  const postId = req.params.postId;
  const comment = req.body;
  Posts.findByIdAndUpdate(
    postId,
    { $push: { comments: comment } },
    { new: true },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

router.put("/deleteComment/:postId", (req, res) => {
  const postId = req.params.postId;
  const commentId = req.body.commentId;
  Posts.findByIdAndUpdate(
    postId,
    { $pull: { comments: { _id: commentId } } },
    { new: true },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

router.delete("/deletePost/:postId", (req, res) => {
  const postId = req.params.postId;
  console.log(postId);
  Posts.findByIdAndRemove(postId, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

export default router;
