
(function(){
  var app = angular.module('routesSelf', ['ngRoute']);

  app.config(function($routeProvider, $locationProvider){

      $routeProvider

            .when('/', {
                templateUrl : 'templates/homepage.html',
                controller  : 'homepageController'
            })

            // route for the about page
            .when('/project/:projectId', {
                templateUrl : 'templates/singlepage.html',
                controller  : 'singlepageController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            })
            .otherwise(
{redirectTo : "/"}
);;

            // $locationProvider.html5Mode(true);
  });


    app.controller('singlepageController', function($scope, $routeParams, $location) {
        // create a message to display in our view
        //$scope.pageTitle =
        var projectid = $scope.projectId = $routeParams.projectId;
        console.log("id= ", $scope.projectId)
        //$scope.item = Model.get(id);
        //$scope.message = 'Everyone come and see how good I look!';
    });

    app.controller('homepageController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    app.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });


})();
