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

let User = {
  displayname:"David Turk",
  start: "Jan 1, 1970",
  username: "David",
  id: 1
};

let Posts = [
  {
    author: "David Turk",
    body: "This is the first post!",
    liked: true,
    likedBy: ["Sara", "Cornbread", "Steve Jobs"],
    delete: true
  },
  {
    author: "Cornbread",
    body: "Meow.  Meow-meow",
    liked: false,
    likedBy: [],
    delete: false
  },
  {
    author: "David Turk",
    body: "Why is my cat gobbling?",
    liked: true,
    likedBy: ["Sara"],
    delete: true
  },
  {
    author: "Sara",
    body: "I have a weird cat...",
    liked: true,
    likedBy: ["David Turk"],
    delete: false
  },
  {
    author: "Steve Jobs",
    body: "Why didn't I think of this?!",
    liked: false,
    likedBy: [],
    delete: false
  },
  {
    author: "Martha",
    body: "Where am I?",
    liked: true,
    likedBy: ["Cornbread"],
    delete: false
  },
  {
    author: "David Turk",
    body: "Total Sue move...",
    liked: true,
    likedBy: ["Sara", "Cornbread"],
    delete: true
  },
  {
    author: "David Turk",
    body: "Don't like this gobble",
    liked: false,
    likedBy: [],
    delete: true
  },
  {
    author: "Cornbread",
    body: "Meow",
    liked: true,
    likedBy: ["Martha"],
    delete: false
  },
  {
    author: "Sara",
    body: "Last Post!",
    liked: false,
    likedBy: [],
    delete: false
  },
];

router.get("/", (req, res) => {
  res.render("gobl");
});

router.get("/:userId/:username", (req, res) => {
  res.render("home", {user: User, posts: Posts});
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

router.post("/:userId/:username/post" , (req, res) => {
  req.checkBody("post","No message to post!").notEmpty();

  let errors = req.validationErrors();

  if(!errors){
    //Create a new message
    let newMessage = {
      body: req.body.post,
      userId: req.params.userId
    };
    models.Messages.create(newMessage).then( (newMessage) => {
      res.redirect("/home/" + req.params.userId+"/" + req.params.username);
    })
  }
  else{
    res.redirect("/home/" + req.params.userId+"/" + req.params.username);
  }
})

router.post("/:userId/:username/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
