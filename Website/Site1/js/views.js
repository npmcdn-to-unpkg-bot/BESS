(function(){
  var app = angular.module('view-templates', []);


  app.directive("homepage", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/homepage.html"
    };
  });

  app.directive("card", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/card.html"
    };
  });

  app.directive("single_page", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/single_page.html"
    };
  });

  app.directive("menu", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/menu.html"
    };
  });

  app.directive("about", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/about.html"
    };
  });

  app.directive("vierprojecten", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/vierprojecten.html"
    };
  });

  app.directive("contact", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/contact.html"
    };
  });

})();
