const express = require("express");
require("dotenv").config();
const app = express();
const prisma = require("./prisma/client");
const cookieParser = require("cookie-parser");

//json web token
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
const cookieExtractor = (req) => {
  if (req && req.cookies) return req.cookies.accessToken || null;
  return null;
};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_ACCESS_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.userId,
        },
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

const { authenticateWithRefresh } = require("./prisma/refreshToken");

app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());

const authRouter = require("./routes/authRouter");

app.use(passport.initialize());

//set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", async (req, res) => {
  res.send("Hello World");
});

//--- ROUTERS ---

app.use("/auth", authRouter);

app.get("/dashboard", authenticateWithRefresh, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    email: req.user.email,
    id: req.user.id,
  });
});

app.listen(3000, () => {
  console.log("Server listening on 3000!");
});
