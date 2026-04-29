const express = require("express");
const jwt = require("jsonwebtoken");

const regd_users = express.Router();

let users = [];

const books = require("./general").books;

// Register
regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user" });
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered",
  });
});

// Login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!validUser) {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }

  const token = jwt.sign({ username }, "access", {
    expiresIn: "1h",
  });

  req.session.authorization = {
    token,
    username,
  };

  return res.status(200).json({
    message: "Login successful!",
  });
});

// Add / Modify Review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

// Delete Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!req.session.authorization) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = regd_users;