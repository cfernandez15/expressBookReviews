const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getAllBooks
  .then( result => res.status(200).send(result))
  .catch( error => res.status(400).send('There was an error '+error))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getBookByISBN(req.params.isbn)
  .then ( result => res.send(result))
  .catch ( error => res.status(400).send(error))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  getBooksByAuthor(req.params.author)
  .then( result => res.send(result))
  .catch( error => res.status(400).send(error))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let keys = Object.keys(books);
  keys.forEach( (key) => {
    if (books[key].title === title) {
        res.status(200).send(books[key]);
    }
  })
  return res.status(200).send('Book not found');
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  return res.status(200).send(reviews);
});

let getAllBooks = new Promise((resolve, reject) => {
    resolve(books);
})

let getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject('Book no found')
        }
    })
}

let getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        let keys = Object.keys(books);
        let filtered_books = [];
        keys.forEach( (key) => {
          if (books[key].author === author) {
              filtered_books.push(books[key]);
          }
        })
        if (filtered_books > 0) {
            resolve(filtered_books);
        } else {
            reject('Book not found')
        }
    })
}

let getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
        let keys = Object.keys(books);
        keys.forEach( (key) => {
        if (books[key].title === title) {
            resolve(books[key]);
            }
        })
        reject('Book not found');
    })
}

module.exports.general = public_users;
