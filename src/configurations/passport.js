var facebook = require('./fb.js');
require('../db.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var localStrategy = require('passport-local').Strategy;



module.exports = function(passport){
  // local strategy for when Facebook isn't used to login
    passport.use(new localStrategy(User.authenticate()));
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
    //    console.log('serializing user: ');
    //    console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        //    console.log('deserializing user:',user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Facebook and Twitter
    facebook(passport);
}
