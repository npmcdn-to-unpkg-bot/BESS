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

.service('HttpService', function($http) {
 return {
   getProjects: function() {
     return $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/projects")
         .then(function (response) {
         console.log('Get projects', response);
         return response.data;
       });
   }
 };
});


