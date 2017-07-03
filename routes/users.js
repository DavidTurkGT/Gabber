const express = require('express');
const router = express.Router();
const models = require('../models');

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
        liked: false,
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
    })
    next();
  });
};

const buildPosts = (req, res, next) => {
  Posts = [];
  Messages.forEach( (message) => {
    if(message){
      //Decide if a message should be able to be liked (have you liked it already?)
      message.liked = message.likedBy.indexOf(User.displayname) !== -1;
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

router.get("/:userId/:username",
isLoggedIn, getUser, getMessages, getLikes, buildPosts,
(req, res) => {
  res.render("profile", {user: User, posts: Posts});
});

module.exports = router;
