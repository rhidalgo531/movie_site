var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');


var Movie = new mongoose.Schema({
  title: String,
  genre: String,
  director: String,
  imageUrl: String,
  year: Number,
  rating: Number
});

var Car = new mongoose.Schema({
  car: String,
  color: String
});

var User = new mongoose.Schema({
  registeredDate: String,
  age: Number,
  avatar: String,
  favoriteGenre: String,
  favoriteMovies: [Movie],
  lastMovieRated: String,
  following:  [],
  ratedMovies:  [Movie],
  likedMovies: [Movie],
  dislikedMovies: [Movie]
});

var Rating = new mongoose.Schema({
  rating: Number,
  user: String,
  title: String,
  movie: Movie
});

var Recommendation = new mongoose.Schema({
  user: String,
  user2: String,
  score: Number,
  moviesLikedShared: [],
  moviesDislikedShared: []
});

User.plugin(passportLocalMongoose);

mongoose.model('Movie', Movie);
mongoose.model('User', User);
mongoose.model('Rating', Rating);
mongoose.model('Car', Car);
mongoose.model('Recommendation', Recommendation);

// is the environment variable, NODE_ENV, set to PRODUCTION?
if (process.env.NODE_ENV == 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/final';
}
mongoose.connect(dbconf);
