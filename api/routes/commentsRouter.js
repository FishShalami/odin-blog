const express = require("express");
const router = express.Router();
const { authenticateWithRefresh } = require("../prisma/refreshToken");

const { createComment } = require("../prisma/queries");

router.post("/new", authenticateWithRefresh, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postId, content } = req.body;
    await createComment(postId, userId, content);
    return res.status(201).json({ message: `User ${userId} commented` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
