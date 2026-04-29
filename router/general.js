const express = require("express");
const public_users = express.Router();

let books = {
  "1": {
    author: "Chinua Achebe",
    title: "Things Fall Apart",
    reviews: {
      user1: "Excellent book"
    }
  },
  "2": {
    author: "Hans Christian Andersen",
    title: "Fairy Tales",
    reviews: {}
  },
  "3": {
    author: "Dante Alighieri",
    title: "The Divine Comedy",
    reviews: {}
  }
};

// Get all books
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Get by Author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author.toLowerCase();

  let filtered = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );

  return res.status(200).json(filtered);
});

// Get by Title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title.toLowerCase();

  let filtered = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title
  );

  return res.status(200).json(filtered);
});

// Get Reviews
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
module.exports.books = books;