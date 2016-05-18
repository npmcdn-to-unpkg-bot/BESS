angular.module('ionicApp', ['ionic', 'ionic.contrib.ui.tinderCards'])

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

.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
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

.controller('ProjectDetailCtrl', function($scope, $state, $stateParams, HttpService, $ionicModal) {
  var projectId = $stateParams.projectId;

  HttpService.getProjectDetail(projectId)
    .then(function(response) {
       $scope.projectDetail = response.project;
      console.log($scope.projectDetail);
    });

    HttpService.getQuestionsByProject(projectId)
      .then(function(response) {
         $scope.questions = response.questions;
        console.log($scope.questions);
      });


    $ionicModal.fromTemplateUrl('templates/modal-tinder.html', {
      scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
        });

    $scope.showSwipeTutorial = function() {
          $scope.modal.show();
    };

    /* CARD-SECTION*/

    var cardTypes = [
        { image: 'img/grote-markt.jpg', title: 'So much grass #hippster'},
        { image: 'img/Antwerpen_MAS.jpg', title: 'Way too much Sand, right?'},
        { image: 'img/A_Kaaipark_museum.jpg', title: 'Beautiful sky from wherever'},
    ];

    $scope.cards = [];

    $scope.addCard = function(i) {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }

    for(var i = 0; i < 3; i++) $scope.addCard();

    $scope.cardSwipedLeft = function(index) {
        console.log('Left swipe');
    }

    $scope.cardSwipedRight = function(index) {
        console.log('Right swipe');
    }

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
        console.log('Card removed');
    }
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
   },
   getQuestionsByProject: function(id) {
     // $http returns a promise, which has a then function, which also returns a promise.
     return $http.get(' http://edwardvereertbrugghen.multimediatechnology.be/api/questions/project/' + id)
       .then(function(response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Get questions by project', response);
         return response.data;
      });
   }
 };
});