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

  app.directive("register", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/register.html",
      controller: 'userController',
      controllerAs: 'user'
    };
  });

  app.directive("footer", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/footer.html"
    };
  });

  app.directive("vragenlijst", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/vragenlijst.html"
    };
  });

  app.directive("timeline", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/timeline.html",
      controller: 'timelineController',
      controllerAs: 'timeline'
    };
  });

  app.directive("informatie", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/informatie.html"
    };
  });

})();
