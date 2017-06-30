const express = require('express');
const router = express.Router();

router.get("/:userId/:username", (req, res) => {
  res.send("User page for " + req.params.username);
});

module.exports = router;
