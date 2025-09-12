const express = require("express");
require("dotenv").config();
const { getAllUsers, createUserTest } = require("./prisma/queries");

const app = express();

//set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", async (req, res) => {
  // const test = await createUserTest();
  // const allUsers = await getAllUsers();

  // console.log(allUsers);
  res.send("Hello World");
});

// --- SIGNUP ---

app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sign-up",
  });
});

// --- LOGIN ---
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

// app.post("/login", (req, res) => {
//   //do stuff
// });

app.listen(3000, () => {
  console.log("Server listening on 3000!");
});
