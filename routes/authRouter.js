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
  findRefreshToken,
  deleteRefreshTokenById,
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

    // const { accessToken, refreshToken } = generateTokens(user);
    // await addRefreshTokenToWhitelist({ refreshToken, userId: user.id });

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 5 * 60 * 1000, //5 minutes
    // });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 30*24*60*60*1000, //30 days
    // });

    return res.redirect("/login");
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
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    return res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
});

router.post("/refreshToken", async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Missing refresh token");
    }
    const savedRefreshToken = await findRefreshToken(refreshToken);

    if (
      !savedRefreshToken ||
      savedRefreshToken.revoked === true ||
      Date.now() >= savedRefreshToken.expireAt.getTime()
    ) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    const user = await findUserById(savedRefreshToken.userId);
    if (!user) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    await deleteRefreshTokenById(savedRefreshToken.id);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    await addRefreshTokenToWhitelist({
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    // Reset cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendStatus(204);
  res.redirect("/login");
});

module.exports = router;
