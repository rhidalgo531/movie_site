var functions = require('../functions.js');
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
require('../db.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Movie = mongoose.model('Movie');
var Rating = mongoose.model('Rating');
var Recommendation = mongoose.model('Recommendation');


describe('Database Use', function() {

  describe('User', function(){
    it('User Schema should be operational', function() {
        var operational;
        var user = new User({
          username: "Sample User",
          registeredDate: "1/1/1",
          favoriteGenre: "Genre",
          age: 100
        });
        if (user.username !== "Sample User"  || user.registeredDate !== "1/1/1"
      || user.favoriteGenre !== "Genre" || user.age !== 100) {
        operational = false;
      } else {
        operational = true;
      }
      expect(operational).to.equal(true);
    });
  });

  describe('Movie', function() {
    it('Movie Schema should be operational', function() {
      var operationa;
      var movie = new Movie({
        title: "Title",
        genre: "Genre",
        director: "Director",
        year: 0,
        rating: 0
      });
      if (movie.title !== "Title" || movie.genre !== "Genre" || movie.director !== "Director" || movie.year !== 0 || movie.rating !== 0) {
        operational = false;
      } else {
        operational = true;
      }
      expect(operational).to.equal(true);
    });
  });

    describe('Rating', function() {
      it('Rating Schema should be operational', function() {
        var operational;
        var rating = new Rating({
          rating: 0,
          user: "User",
          title: "Title",
        });
        if (rating.rating !== 0 || rating.user !== "User" || rating.title !== "Title") {
          operational = false;
        } else {
          operational = true;
        }
        expect(operational).to.equal(true);
      });
    });

    describe('Recommendation', function() {
      it('Recommendation Schema should be operational', function() {
        var operational;
        var rec = new Recommendation({
          user: "User",
          user2: "User2",
          score: 0,
        });
        if (rec.user !== "User" || rec.user2 !== "User2" || rec.score !== 0) {
          operational = false;
        } else {
          operational = true;
        }
        expect(operational).to.equal(true);
      });
    });

});

describe('Functions For Router', function() {

  describe('#randomize', function() {
    it('should return an array with values in random positions', function() {
      var arrayBefore = [0,1,2,3,4];
      var copyArray = arrayBefore.slice();
      var randomized = false;
      functions.randomize(copyArray);
      if (arrayBefore.length !== copyArray.length) {
        return false;
      }
      else {
        function areDifferent(arrayBefore, copyArray) {
          for (var i = 0; i < arrayBefore.length; i++) {
            if (arrayBefore[i] !== copyArray[i]) {
              return true;
            }
          }
          return false;
        }
        randomized = areDifferent(arrayBefore, copyArray);
      }
      expect(randomized).to.equal(true);
    });
  });

  describe('#containsMovie', function() {
    it('should return true if a movie is in a set', function() {
      var array = [];
      var movie = new Movie({
        title: "Sample Title"
      });
      var movie2 = new Movie({
        title: "Different Title"
      });
      array.push(movie2);
      array.push(movie);
      var result = functions.containsMovie(movie, array);
      expect(result).to.equal(true);
    });

    it('should return false if a movie is not in a set', function() {
      var array = [];
      var movie = new Movie({
        title: "Sample Title"
      });
      var movie2 = new Movie({
        title: "Different Title"
      });
      var movie3 = new Movie({
        title: "Third Title"
      });
      array.push(movie2);
      array.push(movie);
      var result = functions.containsMovie(movie3, array);
      expect(result).to.equal(false);
    });
  });

  describe('#handleRating', function() {
    it('should return an accurate rating for one movie', function() {
      var array = [];
      var rating = new Rating({
        rating: 3.5,
        title: "Sample Movie"
      });
      array.push(rating);
      var result = functions.handleRating(array);
      expect(result).to.equal('3.50');
    });
    it('should return an accurate rating for multiple movies', function() {
      var array = [];
      var rating = new Rating({
        rating: 3,
        title: "Sample Movie"
      });
      var rating2 = new Rating({
        rating: 5,
        title: "Sample Movie"
      });
      var rating3 = new Rating({
        rating: 4,
        title: "Sample Movie"
      });
      array.push(rating, rating2, rating3);
      var result = functions.handleRating(array);
      expect(result).to.equal('4.00');
    });
  })
});
