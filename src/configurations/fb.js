var FacebookStrategy = require('passport-facebook').Strategy;
require('../db.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var fbConfig = require('./auth.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields: ['email', 'displayName']
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

  //  	console.log('profile', profile);

		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        User.findOne({ 'name' : profile.displayName }, function(err, user) {
	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);
				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	              var today = new Date();
                  var curr = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	                // if there is no user found with that facebook id, create them
	                var newUser = new User({
	                	username: profile.displayName,
	                	registeredDate: curr	,
	                	avatar: "http://emblemsbf.com/img/61373.jpg"
	                });
					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
        });

    }));

};
