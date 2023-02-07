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
      return res.status(404).json({message: "Error logging in"});
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
    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let reviews = books[isbn].review;
  if (req.query.review){
      if (books[isbn]) {
        let review = req.query.review;
        if (reviews) {
            let reviewKeys = Object.keys(reviews);
            reviewKeys.forEach((key) => {
               if (reviews[key] === username) {
                books[isbn].review[username] = review;
                return res.send("Review from "+username+ " has been updated!");
               } 
            });
            Object.assign(reviews, {[username]: review});
            books[isbn].review = reviews;
        } else {
            books[isbn].review = {
                [username]: review,
            }
        }
        
    }
        res.send("Review from "+username+ " has been added!");
      } else {
        res.status(404).json({message: "Book not found"});
      }
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
