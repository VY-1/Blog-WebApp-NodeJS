
const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const Schema = mongoose.Schema;
require("./app");

//create postSchema that contains a title an content
const postSchema = new mongoose.Schema({
    title: String,
    content: String
  
});
//create mongo Posts table using model and document schema 


module.exports.Post = mongoose.model("Post", postSchema);

const userSchema = new Schema({
    email: String,
    password: String,
    googleId: String,
    blog: [postSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports.User = mongoose.model('User', userSchema);