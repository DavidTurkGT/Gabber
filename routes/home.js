const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.send("You are at home!");
});

router.get("/login", (req, res) => {
  res.send("Login page");
});

router.get("/signup", (req, res) => res.send("Sign Up page"));

router.get("/:userId/:username", (req, res) => res.send("Main page"));

router.post("/login/:userId/:username", (req, res) => {
  console.log("logging in ", req.params.username);
  res.redirect("/home/username/userId");
});

router.post("/signup/:username/", (req, res) => {
  console.log("signing up: ", req.params.username);
  res.redirect("/home/username/userId");
});

module.exports = router;
