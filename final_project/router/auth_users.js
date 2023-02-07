const e = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;
  if (!username || !password) {
      return res.status(404).send("Error logging in");
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).send("Invalid Login. Check username and password");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let reviews = books[isbn].reviews;
  if (req.query.review){
      if (books[isbn]) {
        let review = req.query.review;
        if (reviews) {
            let reviewKeys = Object.keys(reviews);
            reviewKeys.forEach((key) => {
               if (reviews[key] === username) {
                books[isbn].reviews[username] = review;
                return res.send("Review from "+username+ " has been updated!");
               } 
            });
            Object.assign(reviews, {[username]: review});
            books[isbn].reviews = reviews;
            return res.send("Review from "+username+ " has been added!");
        } else {
            books[isbn].reviews = {
                [username]: review,
            }
        }
        return res.send("Review from "+username+ " has been added!");
    }
      } else {
        res.status(404).send("Book not found");
      }
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization.username;
    let reviews = books[isbn].reviews;

    if (reviews) {
        let reviewKeys = Object.keys(reviews);
        reviewKeys.forEach((key) => { 
            if (key === username) {
                delete reviews[username];
                books[isbn].reviews = reviews;
                return res.send("The review has been deleted");
            }
        });
        res.status(404).send("This user has not posted any review on this book");
        } else {
        res.status(404).send("This book has no reviews yet");
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
