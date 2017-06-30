const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.render("gobl");
});

router.get("/login", (req, res) => {
  res.send("Login page");
});

router.get("/signup", (req, res) => res.send("Sign Up page"));

router.get("/:userId/:username", (req, res) => res.send("Main page"));

router.post("/login", (req, res) => {
  console.log("logging in ", req.body.username);
  res.redirect("/home/username/userId");
});

router.post("/signup", (req, res) => {
  console.log("signing up: ", req.body.username);
  res.redirect("/home/username/userId");
});

module.exports = router;
