//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//establish connection to mongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_BLOG);

//create postSchema that contains a title an content
const postSchema = {
  title: String,
  content: String

};
//create mongo Posts table using model and document schema 
const Post = mongoose.model("Post", postSchema);



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "We Da Best! 😜";
const contactContent = "The Big-V Enterprise don't reply back to loser, talk among yourself Playa!!  😁";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async function(req, res){

  //find all post documents in Posts table schema
  let postItems = await Post.find({});
  
  res.render("home", {homeContent: homeStartingContent, posts: postItems});

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  
  res.render("compose");
});

app.get("/posts/:postName", async function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  //find all post documents in Posts table schema
  let postItems = await Post.find({});

  postItems.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);
    if (storedTitle === requestedTitle){
      res.render("post", {post:post});
    }else{
      console.log("Not a match");
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
