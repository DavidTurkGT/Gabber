const express = require('express');
const router = express.Router();
const models = require("../models");

router.post("/:return/:messageId/:action", (req, res) => {
  switch (req.params.action) {
    case "like":
      let newLike = {
        userId: req.session.userId,
        messageId: parseInt(req.params.messageId)
      };
      models.Likes.create(newLike).then();
      break;
    case "delete":
      models.Likes.destroy({
        where: {
          messageId: parseInt(req.params.messageId)
        }
      }).then( () => {
        models.Messages.destroy({
          where: {
            id: parseInt(req.params.messageId)
          }
        })
      })
      break;
  }
  res.redirect("/"+req.params.return+"/"+req.session.userId+"/"+req.session.username);
});


module.exports = router;
