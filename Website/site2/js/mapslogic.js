
(function($){
  var app = angular.module('maps-logic-module', []);

  app.controller("mapsController", function($routeParams, $http, $scope, $location, $route){
    var mapslogic = this;
    var mapcreate;
    mapslogic.getMapCreate = function() {
      if (mapcreate) {
        mapcreate.refresh;
        console.log("mapcreate bestaat al");
      } else {
        console.log("mapcreate word gemaakt");
              mapcreate = new GMaps({
                el: '#mapcreate',
                lat: 51.2194475,
                lng: 4.4024643,
                zoom: 12,
                width: '100%' ,
                height: '400px',
                click: function(e) {
                  mapslogic.lat = e.latLng.lat();
                  mapslogic.lng = e.latLng.lng();
                  console.log("lng = " + mapslogic.lat);
                  console.log("lng = " + mapslogic.lng);
                  mapcreate.removeMarkers();
                  mapcreate.addMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    title: 'Gekozen locatie'
                  });
                }
              });
      }

    };

    mapslogic.getMapOverview = function() {
      var map = new GMaps({
        el: '#map',
        lat: 51.2194475,
        lng: 4.4024643,
        zoom: 12
      });
    };

        mapslogic.getMapSinglePage = function(latitude, longitude) {
          var spmap = new GMaps({
            el: '#spmap',
            lat: latitude,
            lng: longitude,
            zoom: 15
          });
              spmap.removeMarkers();
              spmap.addMarker({
                lat: latitude,
                lng: longitude,
                title: 'Project locatie'
              });
        };

  });



})(jQuery);
