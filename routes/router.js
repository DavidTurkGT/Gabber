const express = require('express');
const router = express.Router();
const models = require('../models');

console.log("Debug time....");

//Checking users
models.Users.findAll({
  include: [
    {
      model: models.Messages,
      as: "messages"
    },
    {
      model: models.Likes,
      as: "likes"
    }
  ]
}).then(
  (users) => {
    printBreak();
    console.log("Printing Users...");
    printBreak();
    users.forEach( (user) => {
      console.log("Printing information for user: ", user.dataValues.displayname);
      //Printing messages
      user.messages.forEach( (message) =>{
        console.log("Message: ", message.dataValues.body, message.dataValues.id);
      });
      //Printing likes
      user.likes.forEach( (like) =>{
        console.log("Likes : ",like.dataValues.messageId);
      });
    });
  }
);

//Checking messages
models.Messages.findAll({
  include: [
    {
      model: models.Users,
      as: "user"
    },
    {
      model: models.Likes,
      as: "likes"
    }
  ]
}).then(
  (messages) => {
    printBreak();
    console.log("Printing Messages...");
    printBreak();
    messages.forEach( (message) => {
      console.log("Message: ", message.dataValues.body, message.dataValues.id);
      console.log("Written by user: ", message.dataValues.userId);
    });
  }
);

//Checking likes
models.Likes.findAll({
  include: [
    {
      model: models.Users,
      as:"user"
    },
    {
      model: models.Messages,
      as: "message"
    }
  ]
}).then(
  (likes) => {
    printBreak();
    console.log("Printing Likes....");
    printBreak();
    likes.forEach( (like) => {
      console.log("Like from user ",like.dataValues.userId);
      console.log("Message liked: ",like.dataValues.messageId);
    });
  }
);



router.get("/", (req,res) => {
  res.send("You made it!");
});

module.exports = router;


function printBreak(){
  console.log("////////////////////");
  console.log("********************");
  console.log("////////////////////");
}
