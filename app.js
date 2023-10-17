//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const user = require("./user");
const passport = require("passport");
const session = require("express-session");
const Post = user.Post;
const User = user.User;

require("./auth");


//establish connection to mongoDB
//mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_BLOG);


const homeStartingContent = "All blogs will be posted here at the home main screen. Enjoy posting your blogs!";
const aboutContent = "We Da Best! 😜";
const contactContent = "The Big-V Enterprise don't reply back to loser, talk among yourself Playa!!  😁";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", async function(req, res){

  let isLoggedIn = req.isAuthenticated();
  console.log(isLoggedIn);

  //find all post documents in Posts table schema
  let postItems = await Post.find({});
  
  res.render("home", {homeContent: homeStartingContent, posts: postItems, isLoggedIn: isLoggedIn});

});

app.get("/auth/google", passport.authenticate("google", {scope:["email", "profile"]})

);

app.get("/auth/google/blog", 
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/compose");
  });

  app.get("/login", function(req, res){
    let isLoggedIn = req.isAuthenticated();
    console.log(isLoggedIn);
    res.render("login", {isLoggedIn: isLoggedIn});
});
app.get("/register", function(req, res){
    
    res.render("register", {isLoggedIn: req.isAuthenticated()});
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent, isLoggedIn: req.isAuthenticated()});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent, isLoggedIn: req.isAuthenticated()});
});

app.get("/compose", function(req, res){
  if (req.isAuthenticated()){
    res.render("compose", {isLoggedIn: req.isAuthenticated()});
  }else{
    res.send("Please login to compose!");
  }
  
  
});

app.get("/posts/:postName", async function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  //find all post documents in Posts table schema
  let postItems = await Post.find({});

  postItems.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);
    if (storedTitle === requestedTitle){
      res.render("post", {post:post, isLoggedIn: req.isAuthenticated()});
    }else{
      console.log("Not a match");
    }
  });
 
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const user = new User({
      username: username,
      password: password
  });

  //passport method for login
  req.login(user, function(err){
      if(err){
          console.log(err);
      }else{
          //authenticate user with cookies in local browser
          passport.authenticate("local")(req, res, function(){
              res.redirect("/");
          });
      }

  }); 

});

app.get("/logout", function(req, res){
  //Passport method to logout
  req.logout(function(err){
      if (err){
          res.send(err);
      }
      else{
          res.redirect("/");
      }
  });
  
});

app.post("/compose", function(req, res){
  let postTitleText=req.body.postTitle;
  let postBodyText=req.body.postBody;

  //create new post document using mongoose model 
  const post = new Post({ title: postTitleText, content: postBodyText});

  //save post document to Posts table schema
  post.save();
  
  res.redirect("/");
 
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
