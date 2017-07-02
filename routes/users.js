const express = require('express');
const router = express.Router();


let User = {
  displayname:"David Turk",
  startdate: "Jan 1, 1970",
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


router.get("/:userId/:username", (req, res) => {
  res.render("profile", {user: User, posts: Posts});
});

module.exports = router;
