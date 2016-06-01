angular.module('ionicApp', ['ionic', 'ionic.contrib.ui.tinderCards', 'angular.filter', 'ngAnimate'])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
//V
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
  })
  .state('project-detail-tinder', {
    url: '/main/project/tinder/:projectId',
    templateUrl: 'templates/project-detail-tinder.html',
    controller: 'ProjectDetailTinderCtrl'
  });

  //On startup or unknown state always route to /login
  $urlRouterProvider.otherwise("/login");

  //Conformities Android and IOS
  //In case of tabs, move them to the bottom on Android and IOS
  $ionicConfigProvider.tabs.position('bottom');

  //Always center title in navbar to center on Android and IOS
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.backButton.previousTitleText(true).text('').icon('ion-android-arrow-back');



})

//Directive to use on ion-view when scrolling is not allowed
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

// START of LoginCtrl (view: login.html)
.controller('LoginCtrl', function($scope, $state, $http, $ionicHistory) {

  // Called to navigate to the main app
  $scope.login = function() {
    $state.go('intro');
  };
  // Called to toggle between registerform and loginform
  $scope.formToggle = function() {
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  }
  //Disable back button after login $state.go
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var user = this;
  $scope.loginFailed = false;

  // HTTP Post function to log in a user
  user.login = function(email, password){
    $http({
      method : "POST",
      url : "http://edwardvereertbrugghen.multimediatechnology.be/api/auth/login",
      data: {
        email: email,
        password: password,
      }
    }).then(function mySucces(response) {
      $scope.loginFailed = false;
      $state.go('intro');
      localStorage.setItem("token", response.data.token);
      user.getData();
    }, function myError(response) {
      $scope.loginFailed = true;
    });
  }

  $scope.registerFailed = false;

  // HTTP Post function to register a user
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
      $scope.registerFailed = true;
      localStorage.setItem("token", response.data.token);
      user.getData();
      $state.go('intro');
    }, function myError(response) {
      $scope.registerFailed = true;
      console.log("register failed");
    });
  };


  // HTTP Request to get all loggin in user details
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
// END of LoginCtrl


// START of IntroCtrl (view: intro.html)

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

// END of IntroCtrl

// START of MainCtrl (view: main.html)

.controller('MainCtrl', function($scope, $state, HttpService, $ionicLoading) {

  // Variable for showing the date in projectCard
  $scope.dateLimit = 10;

  $scope.toIntro = function(){
    $state.go('intro');
  }

  // Show loading stuff while HTTP-service is being processed.
  $ionicLoading.show({
    template: 'Loading...'
  });

  // API Call to get all projects
  HttpService.getProjects()
  .then(function(response) {
    $scope.projects = response;

    // Remove loading plate when HTTP-service is completed
    $ionicLoading.hide();
  });
})

// END of MainCtrl

// START of ProjectDetailCtrl (view: project-detail.html)
.controller('ProjectDetailCtrl', function($scope, $state, $stateParams, HttpService, $ionicModal, $ionicHistory, $ionicNavBarDelegate, $ionicLoading) {
  var projectId = $stateParams.projectId;
  $scope.projectId = projectId;

  $scope.toMain = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $ionicHistory.goBack();
    $ionicNavBarDelegate.title("Projecten");
  }

  // Show loading stuff while HTTP-service is being processed.
  $ionicLoading.show({
    template: 'Loading...'
  });

  HttpService.getProjectDetail(projectId)
  .then(function(response) {
    $scope.projectDetail = response.project;

    // Remove loading plate when HTTP-service is completed
    $ionicLoading.hide();
  });
})

// END of ProjectDetaitCtrl

// START of ProjectDetailTinderCtrl (view: project-detail-tinder.html)

.controller('ProjectDetailTinderCtrl', function($scope, $state, $stateParams, HttpService, $ionicModal, $ionicHistory) {
  var projectId = $stateParams.projectId;

  $scope.toDetail = function() {
    $ionicHistory.goBack();
  }

  HttpService.getProjectDetail(projectId)
  .then(function(response) {
    $scope.projectDetail = response.project;
    console.log($scope.projectDetail);
  });


  HttpService.getQuestionsByProject(projectId)
  .then(function(response) {
    $scope.questions = response.questions;

    // All questions from a project being added into Cardtypes
    var cardTypes = $scope.questions;

    // Boolean to check if there are questions unanswered or not
    $scope.remainingQuestions = false;

    $scope.cards = [];

    // Questions being added to array with only yes/no answers
    $scope.addCard = function(i) {

      if (cardTypes[i].kind ==='yesno') {
        var newCard = cardTypes[i];
        //newCard.id = i;
        //newCard.qId = cardTypes[i].id;
        $scope.cards.push(angular.extend({}, newCard));
      } else {

      }
    }

    for(var i = 0; i < cardTypes.length; i++) $scope.addCard(i);

    $scope.cardSwipedLeft = function(index, projectid, questionid) {
      HttpService.answerNo(index, projectid, questionid);
      console.log('Left swipe');
      console.log('project id = ' +projectid +" question id= "+questionid);
    }

    $scope.cardSwipedRight = function(index, projectid, questionid) {
      HttpService.answerYes(index, projectid, questionid);
      console.log('Right swipe');
      console.log('project id = ' +projectid +" question id= "+questionid);
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

  // Modal when clicked on the button in bottom of view (tutorial)
  $ionicModal.fromTemplateUrl('templates/modal-tinder.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showSwipeTutorial = function() {
    $scope.modal.show();
  };

  // END of ProjectDetailTinderCtrl

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


// HTTP SERVICES FOR API CALLS
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
    },
    answerYes: function(index, projectId, questionId) {

      $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/answers?token=" + localStorage.token,
        data: {
          answer: "Ja",
          question_id: questionId,
          project_id: projectId,
        }
      }).then(function mySucces(response) {
        console.log("Antwoord API JA gelukt.");
      }, function myError(response) {
        console.log("ERROR bij JA-antwoord");
      });
    },
    answerNo: function(index, projectId, questionId) {

      $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/answers?token=" + localStorage.token,
        data: {
          answer: " Nee",
          question_id: questionId,
          project_id: projectId,
        }
      }).then(function mySucces(response) {
        console.log("Antwoord API NEE gelukt");
      }, function myError(response) {
        console.log("ERROR bij NEE-antwoord.");
      });
    }
  };
});
