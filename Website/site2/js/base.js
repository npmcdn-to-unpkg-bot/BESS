$(document).ready(function() {
  //Jquery code here
  console.log("jquery wordt geladen");

  $(".navbar-nav a").click(function() {
    $(".dropdown.open").close();
});

});
