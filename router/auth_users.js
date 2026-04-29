const express = require("express");
const jwt = require("jsonwebtoken");

const regd_users = express.Router();

let users = [];

const books = require("./general").books;

/* Register */
regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Unable to register user"
    });
  }

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(200).json({
      message: "User already exists!"
    });
  }

  users.push({
    username,
    password
  });

  return res.status(200).json({
    message: "User successfully registered"
  });
});

/* Login */
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!validUser) {
    return res.status(200).json({
      message: "Invalid Login. Check username and password"
    });
  }

  const token = jwt.sign({ username }, "access", {
    expiresIn: "1h"
  });

  req.session.authorization = {
    token,
    username
  };

  return res.status(200).json({
    message: "Login successful!"
  });
});

/* Add or Modify Review */
regd_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

/* Delete Review */
regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });
});

module.exports.authenticated = regd_users;