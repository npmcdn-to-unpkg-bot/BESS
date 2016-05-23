(function() {
  var app = angular.module('inspraakStad', ['view-templates', 'routesSelf', 'angular.filter', 'image-upload-module', 'angular-loading-bar', 'maps-logic-module']);




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
          user.logout();
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

  app.controller("timelineController", function($routeParams, $http, $scope, $route){
    var projectId = $scope.projectId = $routeParams.projectId;
    console.log("projectID = " + projectId);
    var timeline = this;
    $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/project/"+ projectId)
    .then(function(response) {
      console.log(response.data.timelines);
      timeline.all = response.data.timelines;
    });

    timeline.addtimelineitem = function(gtitle, gdescription, gdate){

      console.log("er gaat een nieuw tijlijn item toegevoegd worden");

      var projectId = $scope.projectId = $routeParams.projectId;
      console.log("projectID = " + projectId + gtitle + gdescription + gdate);

      $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/timelines?token=" + localStorage.token,
        data: {
          title: gtitle,
          description: gdescription,
          project_id: projectId,
          date: gdate,
        }
      }).then(function mySucces(response) {
        console.log("tijdlijnitem toevoegen gelukt");
        $('#addtimelineitem-modal').modal('hide');
        $route.reload();},
         function myError(response) {
        console.log("tijdlijnitem toevoegen mislukt");
      });


    };

  });

  app.controller("projectController", function($routeParams, $http, $scope, $location){
    var project = this;

    project.create = function(gname, gdescription, gstartdate, genddate, gcategory, glocation, glat, glng){

      $http({
        method : "POST",
        url : "http://edwardvereertbrugghen.multimediatechnology.be/api/projects?token=" + localStorage.token,
        data: {
          name: gname,
          description: gdescription,
          startdate: gstartdate,
          enddate: genddate,
          category: gcategory,
          location: glocation,
          latitude: glat,
          longitude: glng
        }
      }).then(function mySucces(response) {
        console.log("project aanmaken succesvol");
        $('#create-modal').modal('hide');
        $location.path('/projecten');
      }, function myError(response) {
        console.log("project aanmaken failed");
      });
    };

  });

  app.controller ( "questioncontroller", function( $routeParams, $http, $scope, $location ){
    var projectId = $scope.projectId = $routeParams.projectId;
    console.log("projectID = " + projectId);
    var questions = this;
    questions.possibleanswers = [];
    $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/questions/project/"+ projectId)
    .then(function(response) {
      //console.log(response.data);
      //console.log(response.data.questions);
      questions.all = response.data.questions;
      for (var i = 0; i < questions.all.length; i++) {
      //  console.log(questions.all[i].possible_answers);
        console.log(JSON.parse('"'+questions.all[i].possible_answers+'"'));
        var tijdelijk = questions.all[i].possible_answers;
        var tijdelijk = tijdelijk.split(",");
        questions.possibleanswers[questions.all[i].id] = tijdelijk;
      }
      console.log(questions.possibleanswers);
    });
  });


})();
