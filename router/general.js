const express = require("express");
const axios = require("axios");

const public_users = express.Router();

let books = {
  "1": { author: "Chinua Achebe", title: "Things Fall Apart", reviews: {} },
  "2": { author: "Hans Christian Andersen", title: "Fairy Tales", reviews: {} },
  "3": { author: "Dante Alighieri", title: "The Divine Comedy", reviews: {} },
  "4": { author: "Jane Austen", title: "Pride and Prejudice", reviews: {} },
  "5": { author: "Mark Twain", title: "Adventures of Huckleberry Finn", reviews: {} },
  "6": { author: "Charles Dickens", title: "Great Expectations", reviews: {} },
  "7": { author: "Leo Tolstoy", title: "War and Peace", reviews: {} },
  "8": { author: "George Orwell", title: "1984", reviews: {} },
  "9": { author: "Mary Shelley", title: "Frankenstein", reviews: {} },
  "10": { author: "Homer", title: "The Odyssey", reviews: {} }
};

/* Get all books using Promise */
public_users.get("/", function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });
  getBooks.then((booksList) => {
    res.status(200).json(booksList);
  });
});

/* Get by ISBN using Promise callbacks with Axios */
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  axios
    .get("http://localhost:5000/")
    .then((response) => {
      const book = response.data[isbn];
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(() => {
      return res.status(500).json({ message: "Error retrieving ISBN book" });
    });
});

/* Get by Author using async/await with Axios */
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
    const response = await axios.get("http://localhost:5000/");
    const result = Object.values(response.data).filter(
      (book) => book.author.toLowerCase() === author
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving author books" });
  }
});

/* Get by Title using async/await with Axios */
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const response = await axios.get("http://localhost:5000/");
    const result = Object.values(response.data).filter(
      (book) => book.title.toLowerCase() === title
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving title books" });
  }
});

/* Get Reviews */
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (Object.keys(book.reviews).length === 0) {
    return res.status(200).json({
      message: "No reviews found for this book"
    });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
module.exports.books = books;