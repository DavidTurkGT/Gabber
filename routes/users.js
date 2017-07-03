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

const buildUserPosts = (req, res, next) => {
  userPosts = [];
  Messages.forEach( (message) => {
    if(message && message.author === User.displayname){
      //Decide if a message is liked
      message.isLiked = message.likedBy.length > 0;
      //Decide if a message should be able to be liked (have you liked it already?)
      message.canLike = message.likedBy.indexOf(User.displayname) === -1;
      //Decide if a message should be deleteable (are you the author?)
      message.delete = message.author === User.displayname;
      userPosts.push(message);
    }
  });

  //Reverse so that messages are displayed newest first.
  userPosts = userPosts.reverse();
  next();
};

const buildUserLikes = (req, res, next) => {
  userLikes = [];
  Messages.forEach( (message) => {
    if(message && message.likedBy.indexOf(User.displayname) !== -1){
      //Decide if a message is liked
      message.isLiked = message.likedBy.length > 0;
      //Decide if a message should be able to be liked (have you liked it already?)
      message.canLike = message.likedBy.indexOf(User.displayname) === -1;
      //Decide if a message should be deleteable (are you the author?)
      message.delete = message.author === User.displayname;
      userLikes.push(message);
    }
  });

  //Reverse so that messages are displayed newest first.
  userLikes = userLikes.reverse();
  next();
};

let User = {};

let Messages = [];

let userPosts = [];

let userLikes = [];

router.get("/:userId/:username",
isLoggedIn, getUser, getMessages, getLikes, buildUserPosts, buildUserLikes,
(req, res) => {
  res.render("profile", {user: User, posts: userPosts, likes: userLikes});
});

module.exports = router;
