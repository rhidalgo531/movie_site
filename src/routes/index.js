var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var functions = require('../functions.js');
require('../db.js');
var User = mongoose.model('User');
var Movie = mongoose.model('Movie');
var Rating = mongoose.model('Rating');
var Recommendation = mongoose.model('Recommendation');


module.exports = function(passport){
/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/login');
});


router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user){
  if(user) {
    req.logIn(user, function(err){
      res.redirect('/profile/' + user.username);
    });
  }
  else {
    res.render('login', {message: 'Login or Password Incorrect'});
    }
  })(req, res, next);
});

// route for facebook authentication and login
router.get('/login/facebook',
  passport.authenticate('facebook', { scope : 'email' }
));

// handle the callback after facebook has authenticated the user
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile/{user_id}?type=fb',
    failureRedirect : '/error'
  })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

router.get('/signup', function(req, res) {
      User.findOne({username:req.params.username}, function(err, user){
          res.render('signup', {user:user});
      });
});

router.get('/profile/:username', functions.userLoggedIn, function(req, res){
  if (req.isAuthenticated() && ((req.params.username === req.user.username)) || req.query.type === 'fb') {
  if (req.query.type === 'fb') {
  	User.findOne({username:req.user.username}, function(err, user) {
  		Rating.find({user:user.username}, function(err, ratings) {
        res.render('profile', {username: user.username, user:user, tRatings: ratings.length});
      });
  	});
  }
 else {
    User.findOne({username:req.params.username}, function(err, user) {
      Rating.find({user:user.username}, function(err, ratings) {
        res.render('profile', {username: req.params.username, user:user, tRatings: ratings.length});
      });
    });
  }}
  else {
    res.render('login', {message: 'User Must Be Logged In'});
  }
});

router.post('/signup', function(req, res){
  if (req.body.username === "" || req.body.image === "" || req.body.favorite === "" || req.body.password === "") {
    res.render('signup', {message: "Register Detected Data Not Entered"});
  } else {

  var date = new Date();
  User.register(new User({
    username:req.body.username,
    avatar: "/images/" + req.body.image,
    age: parseFloat(req.body.age),
    favoriteGenre: req.body.favorite,
    registeredDate: (date.getMonth() + 1 )+ "/" + date.getDate() + "/" + date.getFullYear()}),
    req.body.password, function(err, user) {
      if (err) {
        res.render('signup', {message: "Registration Information Invalid"});
      }
      else {
        passport.authenticate('local')(req, res, function() {
          res.redirect('/profile/' + user.username);
        });
      }
    });
  }
});

router.get('/board/:username', functions.userLoggedIn, function(req, res){
 if (req.isAuthenticated() && (req.params.username === req.user.username)) {
  User.find({}, function(err, allUsers) {
    User.findOne({username:req.params.username}, function(err, user) { // return current user
      var x = [];
      user.following.filter(function(e, index) { // get array of users following
        x.push(e.username);
      });
      var updatedUsers = allUsers.map(function(ele) { // for all users, check for those that are followers
        if (x.indexOf(ele.username) > -1 || ele.username === user.username) {  // also check for self
          ele.followed = true; // flag to take off Follow Button
        } else {ele.followed = false;}
        return ele;
      });
      res.render('allUsers', {users:updatedUsers, username:req.params.username});
    });
  });
} else {
  res.redirect('/login', {message:'User Must Be Logged In'});
}
});


router.get('/recommended/:username', functions.userLoggedIn, function(req, res) {
  if (req.isAuthenticated() && (req.params.username === req.user.username)) {
    User.findOne({username:req.params.username}).exec(function(err, user) {
      Movie.find({}, function(err, movies){
        Recommendation.find({user:req.params.username}).exec(function(err, recommendations) {
          var promise = functions.compareUsers(user.username);
          setTimeout(function() {
            User.find({}, function(err, users) {
                promise.then(functions.ZScore(movies, recommendations, res, user, users));
            });
          }, 600);
        });
      });
    });
  } else {
    res.redirect('/login', {message:'User Must Be Logged In'});
  }
});

router.get('/api/:username/follow', function(req, res) {
    var following = req.query.name;
    User.findOne({username:req.params.username}, function(err, user) {
      User.findOne({username:following}, function(err, followingUser) {
        user.following.push(followingUser);
        user.save(function(err) {
          if (err) throw err;
        });
      });
    });
    return;
});


router.get ('/api/profile_movie_find', function(req, res) {
    var category = req.query.category;
    var cat_val = req.query.value;
    switch(category) {
      case "year": Movie.find({year: cat_val}, function(err, movies) {
        res.json(movies.map(function(element) {
          return {
            'title': element.title,
            'director': element.director,
            'year': element.year,
            'genre': element.genre,
            'rating': element.rating,
            'image': element.imageUrl
          };
        }));
      });
      break;
      case "rating": Movie.find({rating: cat_val}, function(err, movies) {
        res.json(movies.map(function(element) {
          return {
            'title': element.title,
            'director': element.director,
            'year': element.year,
            'genre': element.genre,
            'rating': element.rating,
            'image': element.imageUrl
          };
        }));
      });
      break;
      case "director": Movie.find({director: cat_val}, function(err, movies) {
        res.json(movies.map(function(element) {
          return {
            'title': element.title,
            'director': element.director,
            'year': element.year,
            'genre': element.genre,
            'rating': element.rating,
            'image': element.imageUrl
          };
        }));
      });
      break;
      case "title": Movie.find({title: cat_val}, function(err, movies) {
        res.json(movies.map(function(element) {
          return {
            'title': element.title,
            'director': element.director,
            'year': element.year,
            'genre': element.genre,
            'rating': element.rating,
            'image': element.imageUrl
          };
        }));
      });
      break;
      case "genre": Movie.find({genre: cat_val}, function(err, movies) {
        res.json(movies.map(function(element) {
          return {
            'title': element.title,
            'director': element.director,
            'year': element.year,
            'genre': element.genre,
            'rating': element.rating,
            'image': element.imageUrl
          };
        }));
      });
      break;
    }
});

router.get('/rate/:username', functions.userLoggedIn, function(req, res, next) {
  if (req.isAuthenticated() && (req.params.username === req.user.username)) {
    Movie.find({}, function(err, movies) {
      functions.randomize(movies);
      Rating.find({title:movies[0].title}, function(err, ratings) {
        if (ratings.length === 0) {
          var currRating = null;
        } else {
          currRating = functions.handleRating(ratings);
      }
        movies[0].rating = currRating;
        movies[0].save();
        res.render('rate', {user:req.user, username:req.user.username, movie:movies[0], avgRating:currRating, submissions: ratings.length});
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post("/api/rate", function(req, res, next) {
  Movie.findOne({title:req.body.title}, function(err, movie) {
    (new Rating({
      rating: parseFloat(req.body.rating),
      user: req.body.username,
      movie: movie,
      title: req.body.title
    })).save(function(err, saved_rating) {
        if (err) {
          throw err;
        }
    });
    User.findOne({username:req.body.username}, function(err, user) {
        user.lastMovieRated = req.body.title;
        user.ratedMovies.push(movie);
        if (req.body.like === "liked") {
          user.likedMovies.push(movie);
        } else if (req.body.like === "disliked") {
          user.dislikedMovies.push(movie);
        }
        user.save();
    });
  });

});

router.post("/api/add", function(req, res, next){
  //console.log(req.body.title, req.body.genre, req.body.director, req.body.imageUrl, req.body.year);
  Movie.find({title:req.body.title, director:req.body.director, year:req.body.year}, function(err, movies) {
    if (movies.length > 0) {
      res.json({movie:"found"});
    } else {
      var movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        director: req.body.director,
        imageUrl: req.body.imageUrl,
        year: parseFloat(req.body.year)
      });
      movie.save(function(err) {
        if (err) throw err;
        res.json({movie:"Not found"});
      });
    }
  });
});

return router;
}
