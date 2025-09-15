const express = require("express");
const router = express.Router();
const { authenticateWithRefresh } = require("../prisma/refreshToken");

const { getAllPosts } = require("../prisma/queries");

router.get("/", authenticateWithRefresh, async (req, res) => {
  try {
    const posts = await getAllPosts();
    if (!posts || posts.length === 0) {
      return res.json({ posts: [] });
    }
    return res.json({
      posts,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
