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
  res.redirect("/home");
});

module.exports = router;
