const express = require('express');
const router = express.Router();
const models = require("../models");


router.get("/", (req, res) => {
  res.render("gobl");
});

router.get("/login", (req, res) => {
  res.send("Login page");
});

router.get("/signup", (req, res) => res.send("Sign Up page"));

router.get("/:userId/:username", (req, res) => res.send("Main page"));

router.post("/login", (req, res) => {
  models.Users.findOne({
    where: {
      username: req.body.username
    }
  }).then ( (user) => {
    if(!user) {
      let error = ["Invalid Username/Password"];
      res.render("gobl", {errors: error});
    }
    else{
      if (user.password === req.body.password){
        res.redirect("/home/"+user.id+"/"+user.username);
      }
      else{
        let error = ["Invalid Username/Password"];
        res.render("gobl", {errors: error});
      }
    }
  })
});

router.post("/signup", (req, res) => {
  console.log("signing up: ", req.body.username);
  res.redirect("/home/username/userId");
});

module.exports = router;
