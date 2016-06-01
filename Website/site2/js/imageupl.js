//everything to do with images is in this javascript file / angular module
var imageToUpload;

function readURL(input) {
    if (input.files && input.files[0]) {
        //imageupload front-end
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.image-upload-wrap').hide();
            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();
            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);
        // console.log(input.files);
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
$('.image-upload-wrap').bind('dragover', function() {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function() {
    $('.image-upload-wrap').removeClass('image-dropping');
});
// activate slick carrousel
function activateslick() {
    // console.log("slick");
    $('.slickimages').slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        responsive:
        [{
            breakpoint: 990,
            settings: {
                adaptiveHeight: true
            }
        }, {
            breakpoint: 768,
            settings: {
                arrows: false,
                adaptiveHeight: true,
                autoplay: false,
            }
        }]
    });

}

(function($) {

    var app = angular.module('image-upload-module', []);

    app.controller("imageController", function($routeParams, $http, $scope, $location, $route) {
        var images = this;
        //get projectid from url
        var projectId = $scope.projectId = $routeParams.projectId;

        //with this function you can upload an image for a project
        images.upload = function() {

            // console.log("click");
            // console.log(imageToUpload);
            // console.log("projectId = " + projectId);

            var form = new FormData();
            form.append("image", imageToUpload);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://edwardvereertbrugghen.multimediatechnology.be/api/image/add/" + projectId + "?token=" + localStorage.token,
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

            //using jquery ajax call for image upload because angular ajax call gave errors
            $.ajax(settings).then(function mySucces(response) {
                //console.log("foto uploaden succesvol");
                removeUpload();
                //$('#imageupload-modal').modal('hide');
                location.reload();
            }, function myError(response) {
                //console.log("foto uploaden failed");
            });
        };

        //get images per project
        images.get = function() {
            $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/image/project/" + projectId)
                .then(function mySucces(response) {
                    //activate slick carrousel
                    activateslick();
                    // console.log(response.data.images);
                    images.all = response.data.images;
                    images.firstone = "http://edwardvereertbrugghen.multimediatechnology.be/uploads/" + response.data.images[response.data.images.length - 1].filename;
                    for (var i = 0; i < response.data.images.length; i++) {
                        //add images to slick carrousel
                        $('.slickimages').slick('slickAdd', '<img src="http://edwardvereertbrugghen.multimediatechnology.be/uploads/' + response.data.images[i].filename + '" alt="image"/>');
                        $(window).trigger('resize');
                    }

                }, function myError(response) {
                    // console.log("image fetch failed probably because image does not exist yet.");
                    images.all = null;
                    images.firstone = null;

                });
        };

        //get one image for projects overview cards
        images.getfirstbyid = function(gid) {
            images.firstonebyid = [];
            $http.get("http://edwardvereertbrugghen.multimediatechnology.be/api/image/project/" + gid)
                .then(function mySucces(response) {

                    if (response.data.images) {
                        images.firstonebyid[gid] = "http://edwardvereertbrugghen.multimediatechnology.be/uploads/" + response.data.images[response.data.images.length - 1].filename;
                        // console.log("gid adres image = " + images.getfirstbyid[gid]);
                    } else {
                        // console.log("image fetch failed probably because image does not exist yet.");
                        images.firstonebyid[gid] = null;
                    }
                }, function myError(response) {
                    // console.log("sever error.");
                    images.firstonebyid[gid] = null;
                });
        };
    });
})(jQuery);
