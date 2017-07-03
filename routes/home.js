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
};

const getUser = (req, res, next) => {
  User = {};
  models.Users.findById(parseInt(req.session.userId)).then( (user) => {
    User = {
      displayname: user.displayname,
      startdate: user.createdAt,
      username: user.username,
      id: user.id
    }
    next();
  });
};

const getMessages = (req, res, next) => {
  Messages = [];
  models.Messages.findAll({
    include: [
      {
        model: models.Users,
        as: "user"
      }
    ]
  }).then( (messages) =>{
    messages.forEach ( (message) => {
      Messages[ message.dataValues.id - 1 ] = {
        id: message.dataValues.id,
        author: message.user.dataValues.displayname,
        body: message.dataValues.body,
        isLiked: false,
        canLike: true,
        likedBy: [],
        delete: false
      };
    })
    next();
  });
};

const getLikes = (req, res, next) => {
  models.Likes.findAll({
    include: [
      {
        model: models.Users,
        as: "user"
      }
    ]
  }).then( (likes) =>{
    likes.forEach( (like) => {
      let liker = like.user.dataValues.displayname;
      Messages[ like.messageId - 1 ].likedBy.push(liker);
    });
    next();
  });
};

const buildPosts = (req, res, next) => {
  Posts = [];
  Messages.forEach( (message) => {
    if(message){
      //Decide if a message is liked
      message.isLiked = message.likedBy.length > 0;
      //Decide if a message should be able to be liked (have you liked it already?)
      message.canLike = message.likedBy.indexOf(User.displayname) === -1;
      //Decide if a message should be deleteable (are you the author?)
      message.delete = message.author === User.displayname;
      Posts.push(message);
    }
  });

  //Reverse so that messages are displayed newest first.
  Posts = Posts.reverse();
  next();
};

let User = {};

let Messages = [];

let Posts = [];

let errorMessages = [];

router.get("/", (req, res) => {
  res.render("gobl");
});

router.get("/:userId/:username",
  isLoggedIn, getUser, getMessages, getLikes, buildPosts,
  (req, res) => {
  res.render("home", {user: User, posts: Posts, errors: errorMessages});
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
  let errors;
  errorMessages = [];

  req.checkBody("post","No message to post!").notEmpty();

  errors = req.validationErrors();

  if(req.body.post.length > 140){
    console.log("ERROR! Too long of a post!");
    errors = "Your post must be no more than 140 characters";
    errorMessages.push(errors);
  }
  if(!errors){
    //Create a new message
    let newMessage = {
      body: req.body.post,
      userId: req.params.userId
    };
    models.Messages.create(newMessage).then( (newMessage) => {
      res.redirect("/home/" + req.params.userId+"/" + req.params.username);
    });
  }
  else{
    //There is a concious choice that no error message should display for an empty post, just a re-rendering of the page
    res.redirect("/home/" + req.params.userId+"/" + req.params.username);s
  }
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
