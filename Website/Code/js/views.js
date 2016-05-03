(function(){
  var app = angular.module('view-templates', []);

  app.directive("menu", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/menu.html"
    };
  });

  app.directive("home", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/home.html"
    };
  });
})();
