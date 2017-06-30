const express = require('express');
const router = express.Router();
const models = require('../models');
const homeRouter = require('./home.js');
const postRouter = require('./posts.js');
const userRouter = require('./users.js');

router.use("/home", homeRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);

router.get("/", (req,res) => {
  if(req.session.username && req.session.userId){
    res.redirect("/home/"+req.session.userId+"/"+req.session.username);
  }
  else{
    res.redirect("/home");
  }
});

module.exports = router;
