(function() {
    var app = angular.module('inspraakStad', ['view-templates', 'routesSelf', 'angular.filter', 'image-upload-module', 'angular-loading-bar', 'maps-logic-module', 'pickadate', 'toastr', 'ngAnimate', 'xeditable']);
    //for inline editing xeditable at profile
    app.run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });
    //notifications config
    app.config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            closeButton: true,
            extendedTimeOut: 1000,
            progressBar: true,
            tapToDismiss: true,
            autoDismiss: true,
            maxOpened: 3,
            newestOnTop: true,
            positionClass: 'toast-bottom-center',
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            //preventOpenDuplicates: true,
        });
    });
    // no loading bar spinner
    app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);


    app.controller("PanelController", function() {
        this.tab = 1;
        this.selectTab = function(setTab) {
            this.tab = setTab;
        };
        this.isSelected = function(checkTab) {
            return this.tab === checkTab;
        };
    });

    app.controller("userController", function($http, toastr, $location) {
        var user = this;
        user.login = function(gusername, gpassword) {
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/auth/login",
                data: {
                    email: gusername,
                    password: gpassword,
                }
            }).then(function mySucces(response) {
                //console.log("login succesvol token=" + response.data.token);
                $('#login-modal').modal('hide');
                localStorage.setItem("token", response.data.token);
                user.getData();
                toastr.success('Login gelukt', 'Welkom');
            }, function myError(response) {
                //console.log("login failed");
                toastr.error('Inloggegevens incorrect', 'Error');
            });
        }

        user.register = function(gvoornaam, gachternaam, gusername, gpassword) {
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/auth/signup",
                data: {
                    firstname: gvoornaam,
                    name: gachternaam,
                    email: gusername,
                    password: gpassword,
                }
            }).then(function mySucces(response) {
                //console.log("registratie succesvol token=" + response.data.token);
                localStorage.setItem("token", response.data.token);
                user.getData();
                $('#register-modal').modal('hide');
            }, function myError(response) {
                //console.log("register failed");
                toastr.error('Email en passwoord zijn verplicht', 'Error');
            });
        };

        user.getData = function() {
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
                    user.lastname = localStorage.lastname;
                    user.email = localStorage.email;
                    if (localStorage.residence) {
                        user.residence = localStorage.residence;

                    } else {
                        user.residence = 'Onbekend';
                    }

                    user.isAdmin = localStorage.isAdmin;
                    //console.log(user.firstname);
                }, function myError(response) {
                    //console.log("User ophalen failed");
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
            $location.path('/');

        };

        user.changename = function(gfirstname, glastname) {
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/user/changename?token=" + localStorage.token,
                data: {
                    firstname: gfirstname,
                    name: glastname,
                }
            }).then(function mySucces(response) {
                toastr.success('Naam veranderd');
            }, function myError(response) {
                toastr.error('Naam veranderen mislukt', 'Error');
            });
        }

        user.changepassword = function(gpassword1, gpassword2) {

            if (gpassword1 === gpassword2){
              console.log(gpassword1, gpassword2);


              $http({
                  method: "POST",
                  url: "http://edwardvereertbrugghen.multimediatechnology.be/api/user/changepassword?token=" + localStorage.token,
                  data: {
                      newpassword: gpassword1,
                  }
              }).then(function mySucces(response) {
                  toastr.success('Wachtwoord gewijzigd');
                  $('#changepassword-modal').modal('hide');
              }, function myError(response) {
                  toastr.error('Wachtwoord wijzigen mislukt', 'Error');
              });

            };
        }

        user.changeresidence = function(gresidence) {
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/user/changeresidence?token=" + localStorage.token,
                data: {
                    residence: gresidence
                }
            }).then(function mySucces(response) {
                toastr.success('District Veranderd');
            }, function myError(response) {
                toastr.error('District veranderen mislukt', 'Error');
            });

        }
        user.changeemail = function(gemail) {
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/user/changeemail?token=" + localStorage.token,
                data: {
                    email: gemail
                }
            }).then(function mySucces(response) {
                toastr.success('Email Veranderd');
            }, function myError(response) {
                toastr.error('Email veranderen mislukt', 'Error');
            });

        }
        user.getLeaderboard = function() {
            $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/leaderboards")
                .then(function(response) {
                    //console.log(response.data);
                    user.leaderboards = response.data;
                });
        }
    });

    app.controller("timelineController", function($routeParams, $http, $scope, $route, toastr) {

        var timelines = this;
        var projectId = $scope.projectId = $routeParams.projectId;
        var timelineEditId;

        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/project/" + projectId)
            .then(function(response) {
                //console.log(response.data.timelines);
                timelines.all = response.data.timelines;
            });

        //timelineitem add

        timelines.addtimelineitem = function(gtitle, gdescription, gdate) {
            //get projectid from url
            var projectId = $scope.projectId = $routeParams.projectId;

            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/timelines?token=" + localStorage.token,
                data: {
                    title: gtitle,
                    description: gdescription,
                    project_id: projectId,
                    date: gdate,
                }
            }).then(function mySucces(response) {
                    //console.log("add timelineitem succeed");
                    $('#addtimelineitem-modal').modal('hide');
                    //reload page so timeline is visible
                    location.reload();
                    toastr.info('mijlpaal toegevoegd', 'Joepie');
                },
                function myError(response) {
                    //console.log("add timelineitem failed");
                    toastr.error('Er is iets misgelopen bij het toevoegen van een mijlpaal, alle velden ingevuld?', 'Error');
                });


        };

        //timeline getID
        timelines.getTimelineId = function(timelineId) {
            timelineEditId = timelineId;
            //console.log(timelineEditId);
            $('#edittimelinemodal').modal('show');
        };

        // edit timelineitem
        timelines.edittimelineitem = function(nTitle, date, description) {
            // console.log(nTitle);
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/" + timelineEditId + "?token=" + localStorage.token,
                data: {
                    date: date,
                    description: description,
                    title: nTitle
                }
            }).then(function mySucces(response) {
                //console.log("Timeline item is geupdatet!");
                location.reload();
                //console.log(timelines.all);
            }, function myError(response) {
                //console.log("Timeline item updaten failed!");
            });
        };




        // delete timelineitem

        timelines.deletetimelineitem = function() {
            $http({
                method: "DELETE",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/timelines/" + timelineEditId + "?token=" + localStorage.token
            }).then(function mySucces(response) {
                //console.log("Timeline deel deleten succeed");
                location.reload();
            }, function myError(response) {
                //console.log("Timeline deel verwijderen failed!");
                toastr.error('Er is iets misgelopen, uw mijlpaal is niet verwijderd.', 'Mislukt!');
            });
        };


    });

    app.controller("projectController", function($routeParams, $http, $scope, $location, toastr) {
        var project = this;

        //create project
        project.create = function(gname, gdescription, gstartdate, genddate, gcategory, glocation, glat, glng) {
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/projects?token=" + localStorage.token,
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
                //console.log("project aanmaken succesvol");
                $('#create-modal').modal('hide');
                $location.path('/projecten');
            }, function myError(response) {
                toastr.error('Uw project is niet aangemaakt. alles ingevuld?', 'Mislukt!');
                //console.log("project aanmaken failed");
            });
        };


        //edit project
        project.edit = function(gname, gdescription, gstartdate, genddate, gcategory, glocation, glat, glng) {

            var projectId = $scope.projectId = $routeParams.projectId;

            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/projects/" + projectId + "?token=" + localStorage.token,
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
                // console.log("project aanpassen succesvol");
                $('#edit-modal').modal('hide');
                location.reload();
            }, function myError(response) {
                toastr.error('Er is iets misgelopen, uw project is niet aangepast.', 'Mislukt!');
                // console.log("project aanpassen failed");
            });
        };




        //delete project
        project.delete = function() {

            var projectId = $scope.projectId = $routeParams.projectId;

            $http({
                method: "DELETE",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/projects/" + projectId + "?token=" + localStorage.token
            }).then(function mySucces(response) {
                // console.log("project delete succeed");
                $('#edit-modal').modal('hide');
                $location.path('/projecten');
                location.reload();
            }, function myError(response) {
                toastr.error('Er is iets misgelopen, Het project is niet verwijderd.', 'Mislukt!');
                // console.log("project delete failed");
            });
        };

    });

    app.controller("questionController", function($routeParams, $http, $scope, $location, toastr) {
        var projectId = $scope.projectId = $routeParams.projectId;
        var questionEditId;

        // console.log("projectID = " + projectId);
        var questions = this;
        questions.possibleanswers = [];
        questions.answers = [];
        questions.temp = [];
        questions.AllCount = [];

        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/questions/project/" + projectId)
            .then(function(response) {
                //console.log(response.data);
                //console.log(response.data.questions);
                questions.all = response.data.questions;
                if (questions.all) {
                    for (var i = 0; i < questions.all.length; i++) {
                        //  console.log(questions.all[i].possible_answers);
                        var temporary = questions.all[i].possible_answers;
                        var temporary = temporary.split(",");
                        questions.possibleanswers[questions.all[i].id] = temporary;
                    }
                }
                // console.log(questions.possibleanswers);
            });

        if (localStorage.token) {

            $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/answers/user?token=" + localStorage.token)
                .then(function(response) {
                    questions.answersFromServer = response.data
                        //console.log(questions.answersFromServer);
                    for (var i = 0; i < questions.answersFromServer.length; i++) {
                        // questions.answers[questions.answersFromServer[i].question_id] = questions.answersFromServer[i].answer;
                        questions.temp[questions.answersFromServer[i].question_id] = questions.answersFromServer[i].answer;
                        questions.totalAnswers = questions.answersFromServer.length;
                        // console.log('aantal opgeloste vragen van deze gebruiker =' + questions.answersFromServer.length);
                    }
                });
        }

        questions.getAllAnswersCount = function(){
              if (localStorage.token) {
                  $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/answers/"+projectId+"?token=" + localStorage.token)
                      .then(function(response) {
                          questions.allAnswersFromServer = response.data.answers;
                              console.log(questions.allAnswersFromServer);

                              console.log(questions.allAnswersFromServer);

                      });
              }
        };

        questions.addQuestion = function(title, kindofQuestion, answers) {
            if (kindofQuestion == 'multiplechoice' && answers == undefined) {
                toastr.error('Vul alsjebieft enkele antwoordmogelijkheden in!', 'Mislukt!');
            } else {
                if (kindofQuestion == 'yesno') {
                    answers = 'Ja, Nee';
                }
                $http({
                    method: "POST",
                    url: "http://edwardvereertbrugghen.multimediatechnology.be/api/questions?token=" + localStorage.token,
                    data: {
                        title: title,
                        kind: kindofQuestion,
                        project_id: projectId,
                        possible_answers: answers
                    }
                }).then(function mySucces(response) {
                    // console.log("Nieuwe vraag is toegevoegd!");
                    // console.log(questions);
                    location.reload();
                }, function myError(response) {
                    // console.log("Nieuwe vraag toevoegen failed!");
                    if (title == undefined) {
                        toastr.error('Vul een vraag in', 'Mislukt!');
                    } else if (kindofQuestion == undefined) {
                        toastr.error('Kies alsjeblieft een soort vraag', 'Mislukt!');
                    }
                });
            }
        };

        questions.getQuestionId = function(questionId) {
            questionEditId = questionId;
            // console.log(questionEditId);
            $('#editquestionmodal').modal('show');
        };

        questions.editQuestion = function(title, kindofQuestion, answers) {
            if (kindofQuestion == 'yesno') {
                answers = 'Ja, Nee';
            }
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/questions/" + questionEditId + "?token=" + localStorage.token,
                data: {
                    title: title,
                    kind: kindofQuestion,
                    possible_answers: answers
                }
            }).then(function mySucces(response) {
                // console.log("Vraag is geupdatet!");
                // console.log(questions);
                location.reload();
            }, function myError(response) {
                // console.log("Vraag updaten failed!");
                if (title == undefined) {}
                toastr.error('Er is iets misgelopen, uw vraag is niet toegevoegd.', 'Mislukt!');
            });
        };

        questions.deleteQuestion = function() {
            $http({
                method: "DELETE",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/questions/" + questionEditId + "?token=" + localStorage.token
            }).then(function mySucces(response) {
                // console.log("Vraag deleten succeed");
                location.reload();
            }, function myError(response) {
                // console.log("Vraag verwijderen failed!");
                toastr.error('Er is iets misgelopen, uw vraag is niet verwijderd.', 'Mislukt!');
            });
        };

        questions.getAnswer = function(answer, qId) {
            // console.log(answer, qId);

            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/answers?token=" + localStorage.token,
                data: {
                    question_id: qId,
                    project_id: projectId,
                    answer: answer
                }
            }).then(function mySucces(response) {
                // console.log("antwoord toevoegen lukte!");
                toastr.success('Antwoord opgeslagen.');
                questions.updatescore();
            }, function myError(response) {
                // console.log("Antwoord toevoegen failed!");
                toastr.warning('Je moet inloggen om de vragenlijst te beantwoorden.', 'Oei!');
            });
        };

        questions.updatescore = function() {
            questions.totalAnswers = questions.totalAnswers + 1;
            var totalAnswers = questions.totalAnswers;
            $http({
                method: "POST",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/user/changescore?token=" + localStorage.token,
                data: {
                    questiontotal: totalAnswers,
                }
            }).then(function mySucces(response) {


            }, function myError(response) {
                toastr.error('Er is iets misgelopen, uw score is niet geupdate.', 'Mislukt!');
            });
        };

    }); //End of questionController

    app.controller("commentController", function($routeParams, $http, $scope, $location, toastr) {
        var comments = this;
        var projectId = $scope.projectId = $routeParams.projectId;

        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/comments/project/" + projectId)
            .then(function(response) {
                comments.all = response.data.comments;
                // console.log(comments.all);
            });

        comments.placeReaction = function(reaction) {
            if (reaction == undefined) {
                toastr.error('Je textveld mag niet leeg zijn.', 'Mislukt!');
            }
            else {
                  $http({
                      method: "POST",
                      url: "http://edwardvereertbrugghen.multimediatechnology.be/api/comments?token=" + localStorage.token,
                      data: {
                          comment: reaction,
                          project_id: projectId
                      }
                  }).then(function mySucces(response) {
                      location.reload();
                  }, function myError(response) {
                      toastr.error('Er is iets misgelopen, uw comment is niet toegevoegd.', 'Mislukt!');
                  });
            }

        };

        comments.deleteComment = function(cId) {
            // console.log("komt ie in");
            $http({
                method: "DELETE",
                url: "http://edwardvereertbrugghen.multimediatechnology.be/api/comments/" + cId + "?token=" + localStorage.token
            }).then(function mySucces(response) {
                location.reload();
            }, function myError(response) {
                toastr.error('Er is iets misgelopen, uw comment is niet verwijderd.', 'Mislukt!');
            });
        };

    }); // End of commentcontroller

})();
