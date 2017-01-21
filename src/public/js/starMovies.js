if (document.getElementsByClassName("stars")) {
  starRating();
}
function starRating() {
  var stars = document.getElementsByClassName("stars");
  for (var i = 0; i < stars.length; i++) {
    stars[i].addEventListener("click", function() {
      document.getElementById("submitted").style.display = "inline-block";
      var title = document.querySelector("#movieTitle").textContent;
      var rating = this.id;
      if (parseFloat(rating) > 3.0) {
        var like = "liked";
      } else {
        like = "disliked";
      }
      var req = new XMLHttpRequest();
      var username = document.getElementById("username").children[0].textContent;
      var url = "http://i6.cims.nyu.edu:15486/api/rate";
      req.open("POST", url, true);
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      req.send('title='+title+'&rating='+rating+'&username='+username+"&like=" + like);
      req.onload = function() {
        console.log("Loaded");
      }
    });
  }
}
