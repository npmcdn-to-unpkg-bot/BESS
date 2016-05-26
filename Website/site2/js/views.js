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
      templateUrl: "templates/login.html"
    };
  });

  app.directive("register", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/register.html"
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



  app.directive("informatie", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/informatie.html"
    };
  });

  app.directive("createproject", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/createproject.html",
      controller: 'projectController',
      controllerAs: 'project'

    };
  });

  app.directive("editproject", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/editproject.html",
      controller: 'projectController',
      controllerAs: 'project'

    };
  });

  app.directive("imageupload", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/imageupload.html",
      controller: 'imageController',
      controllerAs: 'images'

    };
  });

  app.directive("map", function() {
      return {
        restrict: 'E',
        templateUrl: "templates/maps.html",
        controller  : 'mapsController',
        controllerAs: "mapslogic"
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

  app.directive("addtimelineitem", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/addtimelineitem.html",
      controller: 'timelineController',
      controllerAs: 'timelines'

    };
  });

  app.directive("edittimelineitem", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/edittimelineitem.html",
      controller: 'timelineController',
      controllerAs: 'timelines'
    };
  });

  app.directive("addquestion", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/addquestion.html",
      controller: 'questionController',
      controllerAs: 'questions'
    };
  });

  app.directive("editquestion", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/editquestion.html",
      controller: 'questionController',
      controllerAs: 'questions'
    };
  });

  app.directive("leaderboard", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/leaderboard.html",
      // controller: 'leaderboardController',
      // controllerAs: 'leaderboard'
    };
  });

  app.directive("commentsection", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/commentsection.html",
      controller: 'commentController',
      controllerAs: 'comments'
    };
  });

})();
