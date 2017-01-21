if (document.getElementsByClassName("addButton")) {
  addFollower();
}
function addFollower() {
    var eachButton = document.getElementsByClassName("addButton");
    for (var i = 0; i < eachButton.length; i++) {
      eachButton[i].addEventListener("click", function(event)  {
          var req = new XMLHttpRequest();
          var username = document.getElementById("username").children[0].textContent;
          var url ="http://i6.cims.nyu.edu:15486/api/" + username + "/follow/?name=" + this.value;
          req.open("GET", url, true);
          window.alert("Now Following " + this.value);
          req.onload = function() {
            console.log("load");
          }
          req.onerror = function() {
            console.log("error");
          };
          req.send();

      });
    }
}
