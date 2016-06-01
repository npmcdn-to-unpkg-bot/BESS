console.log("javascript.js ingeladen.");

$('#dansen').click(function() {
  $('form').animate({
    height: "toggle",
    opacity: "toggle"
  }, "slow");
  console.log("click");
});

$("#dansen").on("click", function() {
  console.log("geklikt");
});
