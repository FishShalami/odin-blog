const {
  findRefreshToken,
  deleteRefreshTokenById,
  addRefreshTokenToWhitelist,
  findUserById,
} = require("./queries");
const { generateTokens } = require("./jwt");

const passport = require("passport");

const authenticateWithRefresh = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (user) {
      req.user = user;
      return next();
    }

    // If access token is expired and we have a refresh token cookie, try to refresh
    const noAccessToken = !req.cookies?.accessToken;
    const expired =
      info &&
      (info.name === "TokenExpiredError" ||
        info.message === "jwt expired" ||
        info.toString?.().includes("expired"));

    const rt = req.cookies?.refreshToken;

    // Only attempt refresh when we have an RT and either token is expired or missing
    if ((!expired && !noAccessToken) || !rt) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const saved = await findRefreshToken(rt);
      if (
        !saved ||
        saved.revoked === true ||
        Date.now() >= saved.expireAt.getTime()
      ) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const refreshedUser = await findUserById(saved.userId);
      if (!refreshedUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // rotate refresh token, issue new access token
      await deleteRefreshTokenById(saved.id);
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(refreshedUser);
      await addRefreshTokenToWhitelist({
        refreshToken: newRefreshToken,
        userId: refreshedUser.id,
      });

      // set new cookies
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

      // proceed as authenticated
      req.user = refreshedUser;
      return next();
    } catch (e) {
      return next(e);
    }
  })(req, res, next);
};

module.exports = { authenticateWithRefresh };
