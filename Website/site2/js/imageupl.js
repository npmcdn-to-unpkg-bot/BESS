
var imageToUpload;
function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
    console.log(input.files);
    imageToUpload = input.files[0];

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
  $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
  $('.image-upload-wrap').removeClass('image-dropping');
});

(function($){

  var app = angular.module('image-upload-module', []);

  app.controller("imageController", function($routeParams, $http, $scope, $location){
    var images = this;
    var projectId = $scope.projectId = $routeParams.projectId;

    images.upload = function(){
      console.log("click");
      console.log(imageToUpload);
      console.log("projectId = " + projectId);

      var form = new FormData();
      form.append("image", imageToUpload);

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://edwardvereertbrugghen.multimediatechnology.be/api/image/add/" + projectId + "?token="+localStorage.token,
        "method": "POST",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "3f85b7cf-a66b-f68b-1f82-59b0b24b36e6"
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
      }

      $.ajax(settings).then(function mySucces(response) {
        console.log("foto uploaden succesvol");
        removeUpload();
        $('#imageupload-modal').modal('hide');
        $location.path('/projecten/' + projectId);
      }, function myError(response) {
        console.log("foto uploaden failed");
      });

      // $http({
      //   async: true,
      //   crossDomain: true,
      //   method : "POST",
      //   url : "http://edwardvereertbrugghen.multimediatechnology.be/api/image/add/"+ projectId +"?token=" + localStorage.token,
      //   processData: false,
      //   contentType: false,
      //   mimeType: 'multipart/form-data',
      //   headers: {
      //     'cache-control': "no-cache",
      //   },
      //   data: {
      //     image: imageToUpload
      //   }
      // }).then(function mySucces(response) {
      //   console.log("foto uploaden succesvol");
      //   $('#imageupload-modal').modal('hide');
      //   $location.path('/projecten/' + projectId);
      // }, function myError(response) {
      //   console.log("foto uploaden failed");
      // });
    };

    images.get = function() {
      $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/image/project/"+ projectId)
      .then(function mySucces(response) {
        console.log(response.data.images);
        images.all = response.data.images;
        images.firstone = "http://edwardvereertbrugghen.multimediatechnology.be/uploads/" + response.data.images[0].filename;
      }, function myError(response) {
        console.log("image fetch failed probably because image does not exist yet.");
        images.all = null;
        images.firstone = null;
      });
      // .then(function(response) {
      //   console.log(response.data.images);
      //   images.all = response.data.images;
      //   images.firstone = "http://edwardvereertbrugghen.multimediatechnology.be/uploads/" + response.data.images[0].filename;
      // });
    };

    images.getfirstbyid = function(gid) {
        images.firstonebyid = [];
        $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/image/project/"+ gid)
        .then(function mySucces(response) {
      
          if (response.data.images) {

            images.firstonebyid[gid] = "http://edwardvereertbrugghen.multimediatechnology.be/uploads/" + response.data.images[0].filename;
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

  });



})(jQuery);
