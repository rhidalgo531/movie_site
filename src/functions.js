var mongoose = require('mongoose');
require('./db.js');
var User = mongoose.model('User');
var Movie = mongoose.model('Movie');
var Rating = mongoose.model('Rating');
var Recommendation = mongoose.model('Recommendation');

function userLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

function randomize(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var rand = Math.floor(Math.random()*(i+1));
    var temp = array[i];
    array[i] = array[rand];
    array[rand] = temp;
  }
}

function compareUsers(username) {
  return new Promise(function(succeed, fail) {
  User.find({}, function(err, users) {
    Movie.find({}, function(err, movies) {
      User.findOne({username:username}, function(err, user) {
        var compareAllMatrix = [];
        for (var i = 0; i < users.length; i++) {
          if (users[i].username === username) {
            continue;
          } else {
            var likedIntersection = 0;
            var dislikedIntersection = 0;
            var user1LikedMovies = user.likedMovies;
            var user1DislikedMovies = user.dislikedMovies;
            User.findOne({username:users[i].username}, function(err, user2) {
              var user2LikedMovies = user2.likedMovies;
              var user2DislikedMovies= user2.dislikedMovies;
              var all = [];
              var allLiked = [];
              var allDisliked = [];
              for (var j = 0; j < user1LikedMovies.length; j++) {
                if (containsMovie(user1LikedMovies[j], user2LikedMovies)) { // if user 1 liked movie is in user 2's liked movie set
                  likedIntersection++;
                  allLiked.push(user1LikedMovies[j]);
                }
                if (all.indexOf(user1LikedMovies[j].title) > -1) {

                } else {all.push(user1LikedMovies[j].title)}
              }
              for (var k = 0; k < user1DislikedMovies.length; k++) {
                if (containsMovie(user1DislikedMovies[k], user2DislikedMovies)) { // if user 1 liked movie is in user 2's liked movie set
                  dislikedIntersection++;
                  allDisliked.push(user1DislikedMovies[k]);
                }
                if (all.indexOf(user1DislikedMovies[k].title) > -1) {

                } else {all.push(user1DislikedMovies[k].title)}
              }
              var total = user.ratedMovies.length + user2.ratedMovies.length;
              var score = ((likedIntersection + dislikedIntersection) / total).toFixed(3);
              var comp = {"user":user2.username, "score":score};
              Recommendation.findOne({user:user.username, user2:user2.username}, function(err, recommendations) {
                if (recommendations === null) {
                  (new Recommendation({
                    user: user.username,
                    user2: user2.username,
                    score: score,
                    moviesLikedShared: allLiked,
                    moviesDislikedShared: allDisliked
                  })).save();
                }
                else {
                  recommendations.score = score;
                  recommendations.moviesLikedShared = allLiked;
                  recommendations.moviesDislikedShared = allDisliked;
                  recommendations.save();
                }
              });
              // if score > 50% - add recommendation to database, with user,  with score, user compared,
            //  console.log("User: " + user.username + " User2: " + user2.username + "(" + likedIntersection + "," + dislikedIntersection + ") " + score);
            });
          }
      }
      });
    });
  });
});
}

function containsMovie(movie, movieSet) {
  var result = false;
  for (var i = 0; i < movieSet.length; i++) {
    if (movie.title === movieSet[i].title) {
      result = true;
    }
  }
  return result;
}

function ZScore(movies, recommendations, res, user, users) {
  var maxZ = 0;
  var maxMovie = "";
  for (var i = 0; i < movies.length; i++) {
    if (movies[i].rating >= 3.5) {
      var Zliked = [];
      for (var j = 0; j < recommendations.length; j++) {
        for (var k = 0; k < users.length; k++) {
          if (users[k].username === recommendations[j].user2) {
            if (containsMovie(movies[i], users[k].ratedMovies)) {
              Zliked.push(recommendations[j].score);
          }
          }
        }
      //  if (containsMovie(movies[i], recommendations[j].moviesLikedShared)) {
      //    Zliked.push(recommendations[j].score);
      //  }
        if (j === (recommendations.length - 1) && Zliked.length > 0){
          var total = Zliked.reduce(function(sum, ele) {
            return sum + ele;
          });
          var avg = total / Zliked.length;
          if (maxZ < avg) {
            maxZ = avg;
            maxMovie = movies[i];
          }
        }
      }
    }
  }
  var data = {maxMovie:maxMovie, zscore:(((maxZ*100).toFixed(2))+"%")};
  res.render('recommend', {user:user, username:user.username, movie:data.maxMovie, zscore:data.zscore});
}

function handleRating(ratings) {
  var x = [];
  for (var i = 0; i < ratings.length; i++) {
    x.push(ratings[i].rating);
  }
  var currRating = (x.reduce(function(total, sum) {
    return total + sum;
  }) / ratings.length).toFixed(2);
  return currRating;
}

module.exports = {
  userLoggedIn: userLoggedIn,
  randomize: randomize,
  compareUsers: compareUsers,
  containsMovie: containsMovie,
  ZScore: ZScore,
  handleRating: handleRating
}
