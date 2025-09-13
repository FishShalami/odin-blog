const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const {
  getAllUsers,
  createUser,
  findUserById,
  addRefreshTokenToWhitelist,
} = require("../prisma/queries");
const { generateTokens } = require("../prisma/jwt");

//signup
router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sign-up",
  });
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password) {
      res.status(400).send("You must provide a email and password");
    }
    //hash password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, name, hashedPassword);

    const { accessToken, refreshToken } = generateTokens(user);
    await addRefreshTokenToWhitelist({ refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
    });
    // res.redirect("/login");
  } catch (err) {
    res.status(500).send("Something went wrong");
    next(err);
  }
});

//login
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

module.exports = router;
