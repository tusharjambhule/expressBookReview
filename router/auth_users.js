const express = require("express");
const jwt = require("jsonwebtoken");

const regd_users = express.Router();

let users = [];

const books = require("./general").books;

// Register
regd_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered",
  });
});

// Login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;

  let token = jwt.sign({ username }, "access", {
    expiresIn: "1h",
  });

  req.session.authorization = {
    token,
    username,
  };

  return res.status(200).json({
    message: "User successfully logged in",
  });
});

// Add Review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added successfully",
    reviews: books[isbn].reviews,
  });
});

// Delete Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = regd_users;