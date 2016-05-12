
(function(){
  var app = angular.module('routesSelf', ['ngRoute']);

  app.config(function($routeProvider, $locationProvider){

      $routeProvider

            .when('/', {
                templateUrl : 'templates/homepage.html',
                controller  : 'homepageController',
                controllerAs: "homepage"
            })

            .when('/projecten', {
                templateUrl : 'templates/projectoverzicht.html',
                controller  : 'projectoverzichtController',
                controllerAs: "projects"
            })

            // route for the about page
            .when('/project/:projectId', {
                templateUrl : 'templates/singlepage.html',
                controller  : 'singlepageController',
                controllerAs: "spproject"

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


    app.controller('singlepageController', function($scope, $routeParams, $location, $http) {
        // create a message to display in our view
        //$scope.pageTitle =
        var spproject = this;
        var projectid = $scope.projectId = $routeParams.projectId;
        console.log("id= ", projectid);
        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/projects/"+projectid)
    .then(function(response) {
      console.log(response.data.project);
      spproject.full = response.data.project;
      spproject.startdate = mysqlDate(response.data.project.startdate);



      spproject.enddate = mysqlDate(response.data.project.enddate);
      spproject.category = response.data.project.category;
      spproject.name = response.data.project.name;
      spproject.description = response.data.project.description;
      spproject.location = response.data.project.location;



        //$scope.myWelcome = response.data;
    });

    });

    app.controller('projectoverzichtController', function($scope, $http) {
      var projects = this;
        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/projects")
    .then(function(response) {
      console.log(response.data);
      projects.all = response.data;

        //$scope.myWelcome = response.data;
    });
    });

    app.controller('homepageController', function($scope, $http) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

function mysqlDate(dateToConvert){
  // Split timestamp into [ Y, M, D, h, m, s ]
  var t = dateToConvert.split(/[- :]/);

  // Apply each element to the Date function
  var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

  return d;
  // -> Wed Jun 09 2010 13:12:01 GMT+0100 (GMT Daylight Time)
}


})();