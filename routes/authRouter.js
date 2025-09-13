// following this tutorial for jwt:
// https://mihai-andrei.com/blog/jwt-authentication-using-prisma-and-express/

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const {
  getAllUsers,
  createUser,
  findUserById,
  addRefreshTokenToWhitelist,
  findUserByEmail,
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("You must provide a email and password");
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const { accessToken, refreshToken } = generateTokens(existingUser);
    await addRefreshTokenToWhitelist({ refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
