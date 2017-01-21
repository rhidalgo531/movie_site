if (document.getElementById("ssSubmit")) {
  findMovies();
  checkMovies();
}
function findMovies() {
  document.getElementById("ssSubmit").addEventListener("click", function(event) {
      var value = document.getElementById("singleSearch").value;
      var category = document.getElementById("profileSearchCriteria").value;
      var req = new XMLHttpRequest();
      var url = "http://i6.cims.nyu.edu:15486/api/profile_movie_find/?value=" + value + "&category=" + category;
      req.open("GET", url, true);
      req.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var response = JSON.parse(this.responseText);
          var aside = document.querySelector(".findM");
          var background = document.getElementById("singleSearchMovies");
          var newBackground = document.createElement("div");
          newBackground.id = "singleSearchMovies";
          for (var i = 0; i < response.length; i++) {
            var div = document.createElement("div");
            var h3 = document.createElement("h3");
            h3.textContent = response[i].title;
            var img = document.createElement("img");
            img.src = response[i].image;
            img.class = "findMoviesImages";
            var p = document.createElement("p");
            p.innerHTML = "Director: " + response[i].director + "<br> Year: " + response[i].year +
            "<br> Genre: " + response[i].genre + "<br> Rating: " + response[i].rating;
            div.append(h3, img, p);
            newBackground.append(div);
          }
          aside.replaceChild(newBackground, background);
        }
      }
      req.onerror = function() {
        console.log("Error");
      }
      req.send();

  });
}

function checkMovies() {
  // Validate Forms
  document.getElementById("addForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var allInputs = document.forms[0].getElementsByTagName("input");
    var count = 0;
    for (var i = 0; i < allInputs.length - 1; i++) {
      if (allInputs[i].value === "") {
        allInputs[i].style.backgroundColor = "red";

      } else {
        allInputs[i].style.backgroundColor = "white";
        count++;
      }
    }
    if (count === allInputs.length - 1) {
      document.getElementById("movieSubmitted").style.display = "none";
      addMovie(allInputs);
    } else {
      document.getElementById("movieSubmitted").style.display = "inline-block";
      document.getElementById("movieSubmitted").textContent= "Please Fill In All Fields!";
    }

  });
}

function addMovie(allInputs) {
  var title = allInputs[0].value;
  var genre = allInputs[1].value;
  var director = allInputs[2].value;
  var imageUrl = allInputs[3].value;
  var year = allInputs[4].value;
  var req = new XMLHttpRequest();
  var url = "http://i6.cims.nyu.edu:15486/api/add";
  req.open("POST", url, true);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send("title=" + title + "&genre=" + genre + "&director=" + director + "&imageUrl=" + imageUrl + "&year=" + year);
  req.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var response = JSON.parse(this.responseText);
      if (response.movie === "found") {
        document.getElementById("movieSubmitted").style.display = "inline-block";
        document.getElementById("movieSubmitted").textContent= "Movie Already In Database!";
      } else {
        document.getElementById("movieSubmitted").style.display = "inline-block";
        document.getElementById("movieSubmitted").textContent= "Movie Submitted!";
      }
    }
    console.log("Loaded");
  }
  req.onerror = function() {
    console.log("Error with Ajax");
  }
}
