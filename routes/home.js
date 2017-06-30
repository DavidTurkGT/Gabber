const express = require('express');
const router = express.Router();
const models = require("../models");

//Middleware
const isLoggedIn = (req,res,next) => {
  if(!req.session.username){
    res.redirect("/home");
  }
  else{
    next();
  }
}

router.get("/", (req, res) => {
  res.render("gobl");
});

router.get("/:userId/:username", isLoggedIn, (req, res) => {
  models.Users.findById(req.params.userId).then( (user) =>{
    user = {
      username: user.username,
      displayname: user.displayname,
      id: user.id
    };
    res.render("home", {user: user});
  });
});

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
        req.session.username = user.username;
        req.session.userId = user.id;
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
  req.checkBody("username", "Please enter a username").notEmpty();
  req.checkBody("password", "Please enter a password").notEmpty();
  req.checkBody("confirmPassword", "Passwords did not match").matches(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    errorList = [];
    errors.forEach( (error) => errorList.push(error.msg));
    res.render("gobl", {errors: errorList});
  }
  else{
  //Check to see if username is taken
  models.Users.findOne({where: {username: req.body.username}}).then( (user) => {
    if(user){
      error = ["Username " + req.body.username + " is already taken."];
      res.render("gobl", {errors: error});
    }
    else{
      let newUser= {
        username: req.body.username,
        password: req.body.password,
        displayname: req.body.username
      };
      models.Users.create(newUser).then( (newUser) => {
        message = ["Created new user: " + newUser.username];
        res.render("gobl", {messages: message});
      });
    }
  });
  }
});

router.post("/:userId/:username/logout", isLoggedIn, (req, res) => {
  console.log("Logging out user: ", req.params.username);
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
