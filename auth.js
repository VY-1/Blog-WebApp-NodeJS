
const passport = require("passport");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require("mongoose-findorcreate");
const user = require("./user");
const User = user.User;


const GOOGLE_CLIENT_ID = "86794719548-kbc475la8mc3r25lmb4k4pv12gcu8d54.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/blog",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
   
  }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});