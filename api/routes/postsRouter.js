const express = require("express");
const router = express.Router();
const { authenticateWithRefresh } = require("../prisma/refreshToken");

const {
  getAllPosts,
  findPostById,
  createPost,
  getPostComments,
} = require("../prisma/queries");

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

router.post("/new", authenticateWithRefresh, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { post_title, content } = req.body;
    await createPost(post_title, content, userId);
    return res.status(201).json({ post_title: post_title, posted_by: userId });
  } catch (err) {
    // res.status(500).json({ message: "Something went wrong" });
    return next(err);
  }
});

router.get("/:id", authenticateWithRefresh, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const post = await findPostById(postId);
    // console.log("Retreiving post with id: ", postId);
    if (!post) {
      return res.status(404).json({ Message: "Post not found" });
    }
    return res.json({
      post,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/comments", authenticateWithRefresh, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const comments = await getPostComments(postId);

    if (!comments || comments.length === 0) {
      return res.json({ comments: [] });
    }
    return res.json({
      comments,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
