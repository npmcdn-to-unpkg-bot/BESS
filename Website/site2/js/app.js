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
        user.getData();
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

    var timeline = this;

    var projectId = $scope.projectId = $routeParams.projectId;
    console.log("projectID = " + projectId);


    $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/project/"+ projectId)
    .then(function(response) {
      console.log(response.data.timelines);
      timeline.all = response.data.timelines;
    });


    //timelineitem add

    timeline.addtimelineitem = function(gtitle, gdescription, gdate){

      var projectId = $scope.projectId = $routeParams.projectId;

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
        console.log("add timelineitem succeed");
        $('#addtimelineitem-modal').modal('hide');
        $route.reload();},
        function myError(response) {
          console.log("add timelineitem failed");
        });


      };



      //timeline getID

      timeline.getId = function(event){
        console.log(event.target.id);
      };



      // edit timelineitem

      timeline.edittimelineitem = function(gId){

        console.log("er gaat geedit worden");
        console.log(gId);

        $http({
          method : "POST",
          url : "http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/" + {timeline_ID} + "?token=" + localStorage.token,
        });
      };




      // delete timelineitem

      timeline.deletetimelineitem = function(){
        console.log("er gaat gedeletet worden");

        // $http({
        //   method : "POST",
        //   url : "http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/" + {timeline_ID} + "?token=XXX" + localStorage.token,
        // }.then(function mySucces(response){
        //   console.log("tijdlijnitem werd succesvol verwijderd");
        //   $('#edittimelineitem-modal').modal('hide');
        // }, function myError(response){
        //   console.log("er ging iets mis bij het verwijderen");
        // }));
      };


    });

    app.controller("projectController", function($routeParams, $http, $scope, $location){
      var project = this;


      //create project
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


      //edit project
      project.edit = function(gname, gdescription, gstartdate, genddate, gcategory, glocation, glat, glng){

        var projectId = $scope.projectId = $routeParams.projectId;

        $http({
          method : "POST",
          url : "http://edwardvereertbrugghen.multimediatechnology.be/api/projects/" + projectId + "?token=" + localStorage.token,
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
          console.log("project aanpassen succesvol");
          $('#edit-modal').modal('hide');
          $location.path('/projecten');
        }, function myError(response) {
          console.log("project aanpassen failed");
        });
      };




      //delete project
      project.delete = function(gname, gdescription, gstartdate, genddate, gcategory, glocation, glat, glng){

        var projectId = $scope.projectId = $routeParams.projectId;

        $http({
          method : "DELETE",
          url : "http://edwardvereertbrugghen.multimediatechnology.be/api/projects/" + projectId + "?token=" + localStorage.token
        }).then(function mySucces(response) {
          console.log("project delete succeed");
          $('#edit-modal').modal('hide');
          $location.path('/projecten');
        }, function myError(response) {
          console.log("project delete failed");
        });
      };

    });

    app.controller ( "questionController", function( $routeParams, $http, $scope, $location ){
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
          //console.log(JSON.parse('"'+questions.all[i].possible_answers+'"'));
          var tijdelijk = questions.all[i].possible_answers;
          var tijdelijk = tijdelijk.split(",");
          questions.possibleanswers[questions.all[i].id] = tijdelijk;
        }
        // console.log(questions.possibleanswers);
      });

      questions.addQuestion = function(title, kindofQuestion, answers) {
        $http({
          method : "POST",
          url : "http://edwardvereertbrugghen.multimediatechnology.be/api/questions?token=" + localStorage.token,
          data: {
            title: title,
            kind: kindofQuestion,
            project_id: projectId,
            possible_answers: answers
          }
        }).then(function mySucces(response) {
          console.log("Nieuwe vraag is toegevoegd!");
          console.log(questions);
          $('#addquestionmodal').modal('hide');
        }, function myError(response) {
          console.log("Nieuwe vraag toevoegen failed!");
        });
      };
    });


  })();
