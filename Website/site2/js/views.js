(function(){
  var app = angular.module('view-templates', []);


  app.directive("homepage", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/projectoverzicht.html"
    };
  });

  app.directive("card", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/card.html"
    };
  });

  app.directive("singlepage", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/singlepage.html"
    };
  });

  app.directive("menu", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/menu.html"
    };
  });
  app.directive("login", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/login.html",
      controller: 'userController',
      controllerAs: 'user'
    };
  });
})();
