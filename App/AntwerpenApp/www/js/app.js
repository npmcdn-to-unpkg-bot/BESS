angular.module('ionicApp', ['ionic', 'ionic.contrib.ui.tinderCards', 'angular.filter'])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'user'
  })
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

  $urlRouterProvider.otherwise("/login");

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


.controller('LoginCtrl', function($scope, $state, $http, $ionicHistory) {

  // Called to navigate to the main app
  $scope.login = function() {
    $state.go('intro');
  };
  $scope.formToggle = function() {
       $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  }
  //Disable back button after login $state.go
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var user = this;
  user.login = function(email, password){
    $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/auth/login",
        data: {
          email: email,
          password: password,
        }
      }).then(function mySucces(response) {
        $state.go('intro');
        localStorage.setItem("token", response.data.token);
        user.getData();
      }, function myError(response) {
        console.log("login failed");
      });
  }

  user.register = function(firstName, lastName, email, password){

      $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/auth/signup",
        data: {
          firstname: firstName,
          name: lastName,
          email: email,
          password: password,
        }
      }).then(function mySucces(response) {
        console.log("registratie succesvol token=" + response.data.token);
        localStorage.setItem("token", response.data.token);
        user.getData();
        $state.go('intro');
      }, function myError(response) {
        console.log("register failed");
      });
    };



  user.getData = function(){
      if (localStorage.token) {
        $http({
          method: "GET",
          url: "http://edwardvereertbrugghen.multimediatechnology.be/api/user?token=" + localStorage.token
        }).then(function mySucces(response) {
          user.loggedin = true;
          localStorage.setItem("firstname", response.data.user.firstname);
          localStorage.setItem("lastname", response.data.user.name);
          localStorage.setItem("email", response.data.user.email);
          localStorage.setItem("isAdmin", response.data.user.isAdmin);
          localStorage.setItem("residence", response.data.user.residence);
          user.firstname = localStorage.firstname;
          user.isAdmin = localStorage.isAdmin;
          console.log(user.firstname);
        }, function myError(response) {
          console.log("User ophalen failed");
          user.logout();
        });
      }
    };


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
        var cardTypes = $scope.questions;
        $scope.remainingQuestions = false;

        $scope.cards = [];


        $scope.addCard = function(i) {

          if (cardTypes[i].kind ==='yesno') {
            var newCard = cardTypes[i];
            newCard.id = i;
            $scope.cards.push(angular.extend({}, newCard));
          } else {

          }

        }

        for(var i = 0; i < cardTypes.length; i++) $scope.addCard(i);

        $scope.cardSwipedLeft = function(index) {
            console.log('Left swipe');
        }

        $scope.cardSwipedRight = function(index) {
            console.log('Right swipe');
        }

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            if ($scope.cards.length == 0) {
              $scope.remainingQuestions = true;
            }
            console.log('Card removed');
        }
      }, function myError(response) {
        $scope.remainingQuestions = true;
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





})

.controller('ImageCtrl', function($scope, $state, $stateParams, HttpService, $ionicModal, $http) {
  var projectId = $stateParams.projectId;
  var images = this;

      images.getfirstbyid = function(gid) {
      images.firstonebyid = [];
      $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/image/project/"+ gid)
      .then(function mySucces(response) {

        if (response.data.images) {

          images.firstonebyid[gid] = "http://edwardvereertbrugghen.multimediatechnology.be/uploads/" + response.data.images[response.data.images.length - 1].filename;
          console.log("gid adres image = "+ images.getfirstbyid[gid]);
        }
        else {
          console.log("image fetch failed probably because image does not exist yet.");
          images.firstonebyid[gid] = null;
        }

      }, function myError(response) {
        console.log("sever error.");
        images.firstonebyid[gid] = null;
      });
    };


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
