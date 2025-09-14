// following this tutorial for jwt:
// https://mihai-andrei.com/blog/jwt-authentication-using-prisma-and-express/

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const isProd = process.env.NODE_ENV === "production";
const crossSite = process.env.CROSS_SITE_COOKIES === "true"; // set in .env when FE is on different origin
const baseCookie = {
  httpOnly: true,
  sameSite: crossSite ? "none" : "lax",
  secure: crossSite ? true : isProd,
};

const {
  getAllUsers,
  createUser,
  findUserById,
  addRefreshTokenToWhitelist,
  findUserByEmail,
  findRefreshToken,
  deleteRefreshTokenById,
} = require("../prisma/queries");
const { generateTokens } = require("../prisma/jwt");

router.post("/signup", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    //hash password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, name, hashedPassword);

    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
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

    res.cookie("accessToken", accessToken, {
      ...baseCookie,
      maxAge: 5 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...baseCookie,
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    return res.json({ id: existingUser.id, email: existingUser.email });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendStatus(204);
});

module.exports = router;
