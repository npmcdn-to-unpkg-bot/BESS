angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider
  .state('intro', {
    url: '/',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })
  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })
  .state('project-detail', {
    url: '/main/project/:projectId',
    templateUrl: 'templates/project-detail.html',
    controller: 'ProjectDetailCtrl'
  });

  $urlRouterProvider.otherwise("/");

  //Conformiteiten rond IOS vs Android
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center')


})



.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

<<<<<<< HEAD
.controller('MainCtrl', function($scope, $state) {
  console.log('MainCtrl');
  
  $scope.toIntro = function(){
    $state.go('intro');
  }
});
=======
.controller('MainCtrl', function($scope, $state, HttpService, $ionicLoading) {


  $scope.toIntro = function(){
    $state.go('intro');
  }


  //Loading
  $ionicLoading.show({
    template: 'Loading...'
  });
  //API Call voor alle projecten
  HttpService.getProjects()
    .then(function(response) {
       $scope.projects = response;
       $ionicLoading.hide();
    });
})

.controller('ProjectDetailCtrl', function($scope, $state, $stateParams, HttpService) {
  var projectId = $stateParams.projectId;

  HttpService.getProjectDetail(projectId)
    .then(function(response) {
       $scope.projectDetail = response.project;
      console.log($scope.projectDetail);
    });
})

.service('HttpService', function($http) {
 return {
   getProjects: function() {
     return $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/projects")
         .then(function (response) {
         console.log('Get projects', response);
         return response.data;
       });
   },
   getProjectDetail: function(id) {
     // $http returns a promise, which has a then function, which also returns a promise.
     return $http.get('http://edwardvereertbrugghen.multimediatechnology.be/api/projects/' + id)
       .then(function(response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Get Project detail', response);
         return response.data;
      });
   }
 };
});
>>>>>>> parent of 6253042... 32
