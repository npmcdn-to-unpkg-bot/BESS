(function() {
  var app = angular.module('inspraakStad', ['view-templates', 'routesSelf', 'angular.filter']);

  app.controller("PanelController", function(){

    this.tab = 1;

    this.selectTab = function(setTab){
      this.tab = setTab;
    };

    this.isSelected = function(checkTab){
      return this.tab === checkTab;
    };
  });

  app.controller("userController", function($http){
    var user = this;
    user.login =  function(gusername, gpassword){

      $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/auth/login",
        data: {
                        email: gusername,
                        password: gpassword,
                    }
    }).then(function mySucces(response) {
        console.log("login succesvol token=" + response.data.token);
        $('#login-modal').modal('hide');
        localStorage.setItem("token", response.data.token);
    }, function myError(response) {
        console.log("login failed");
    });
    }


    user.register = function(gvoornaam, gachternaam, gusername, gpassword){

      $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/auth/signup",
        data: {
                        firstname: gvoornaam,
                        name: gachternaam,
                        email: gusername,
                        password: gpassword,
                    }
    }).then(function mySucces(response) {
        console.log("registratie succesvol token=" + response.data.token);
        localStorage.setItem("token", response.data.token);
        $('#register-modal').modal('hide');
    }, function myError(response) {
        console.log("register failed");
    });
    }
  });

    app.controller("timelineController", function($routeParams, $http, $scope){
      var projectId = $scope.projectId = $routeParams.projectId;
      console.log("projectID = " + projectId);
      var timelines = this;
      $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/project/"+ projectId)
  .then(function(response) {
    console.log(response.data.timelines);
    timelines.all = response.data.timelines;
  });

    });



})();
