(function($){



  var app = angular.module('maps-logic-module', []);

  app.controller("mapsController", function($routeParams, $http, $scope, $location, $route){

    var mapslogic = this;
    mapslogic.getMapCreate = function() {
      var mapcreate = new GMaps({
        el: '#mapcreate',
        lat: 51.2194475,
        lng: 4.4024643,
        zoom: 12,
        width: '100%' ,
        height: '400px'
      });
    };

    mapslogic.getMapOverview = function() {
      var map = new GMaps({
        el: '#map',
        lat: 51.2194475,
        lng: 4.4024643,
        zoom: 12
      });
    };

  });



})(jQuery);
