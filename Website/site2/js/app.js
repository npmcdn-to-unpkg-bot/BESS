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
        user.getData();
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
        });
      }
    };

    user.logout = function() {
      user.loggedin = false;
      user.isAdmin = "";
      localStorage.removeItem("token");
      localStorage.removeItem("firstname");
      localStorage.removeItem("lastname");
      localStorage.removeItem("email");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("residence");
    };


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
