(function() {
    var app = angular.module('routesSelf', ['ngRoute']);

    //all routes are templated here
    app.config(function($routeProvider, $locationProvider) {

        $routeProvider

        // route for the home page
            .when('/', {
            templateUrl: 'templates/homepage.html',
            controller: 'homepageController',
            controllerAs: "homepage"
        })

        // route for the projects overview page
        .when('/projecten', {
            templateUrl: 'templates/projectoverzicht.html',
            controller: 'projectoverzichtController',
            controllerAs: "projects"
        })

        // route for the profile page
        .when('/profiel', {
            templateUrl: 'templates/profiel.html',
        })

        // route for the project single page
        .when('/project/:projectId', {
            templateUrl: 'templates/singlepage.html',
            controller: 'singlepageController',
            controllerAs: "spproject"

        })

        // route for the map page
        .when('/map', {
                templateUrl: 'templates/maps.html',
                controller: 'mapsController',
                controllerAs: "mapslogic"
            })
            .otherwise({
                redirectTo: "/"
            });;

        // $locationProvider.html5Mode(true);
    });

    //get all json data for single project page
    app.controller('singlepageController', function($scope, $routeParams, $location, $http) {
        var spproject = this;
        // get project id from url
        var projectid = $scope.projectId = $routeParams.projectId;
        console.log("id= ", projectid);
        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/projects/" + projectid)
            .then(function(response) {
                //console.log(response.data.project);

                // set all variabels
                spproject.full = response.data.project;
                spproject.startdate = mysqlDate(response.data.project.startdate);
                spproject.enddate = mysqlDate(response.data.project.enddate);
                spproject.category = response.data.project.category;
                spproject.name = response.data.project.name;
                spproject.description = response.data.project.description;
                spproject.location = response.data.project.location;
                spproject.longitude = response.data.project.longitude;
                spproject.latitude = response.data.project.latitude;
            });

    });
    //get all projects for projectoverview
    app.controller('projectoverzichtController', function($scope, $http) {
        var projects = this;
        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/projects")
            .then(function(response) {
                //console.log(response.data);
                projects.all = response.data;
            });
    });

    //get projects for the homepage
    app.controller('homepageController', function($scope, $http) {
        var projects = this;
        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/projects")
            .then(function(response) {
                console.log(response.data);
                projects.all = response.data;
            });
    });
    //convert mysqlDate to javascript date
    function mysqlDate(dateToConvert) {
        // Split timestamp into [ Y, M, D, h, m, s ]
        var t = dateToConvert.split(/[- :]/);

        // Apply each element to the Date function
        var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

        return d;
        // -> Wed Jun 09 2010 13:12:01 GMT+0100 (GMT Daylight Time)
    }


})();
