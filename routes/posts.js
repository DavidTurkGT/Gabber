const express = require('express');
const router = express.Router();

router.post("/:messageId/like", (req, res) => {
  console.log("Liking the message: " + req.params.messageId);
  res.redirect("/home/username/userId");
});

router.post("/:messageId/delete", (req, res) => {
  console.log("Deleting the message: " + req.params.messageId);
  res.redirect("/home/username/userId");
});

module.exports = router;
