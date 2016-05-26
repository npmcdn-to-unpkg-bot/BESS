
(function($){
  var app = angular.module('maps-logic-module', []);

  app.controller("mapsController", function($routeParams, $http, $scope, $location, $route){
    var icon = {
      url: '/img/A-logo.png', // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(26, 26) // anchor
    };

    var mapslogic = this;
    var mapcreate;
    mapslogic.getMapCreate = function() {
      if (mapcreate) {
        mapcreate.refresh;
        console.log("mapcreate bestaat al");
        $(window).trigger('resize');
      } else {
        console.log("mapcreate word gemaakt");
        mapcreate = new GMaps({
          el: '#mapcreate',
          lat: 51.2194475,
          lng: 4.4024643,
          zoom: 12,
          width: '100%' ,
          height: '400px',
          streetViewControl: false,
          click: function(e) {
            mapslogic.lat = e.latLng.lat();
            mapslogic.lng = e.latLng.lng();
            console.log("lng = " + mapslogic.lat);
            console.log("lng = " + mapslogic.lng);
            mapcreate.removeMarkers();
            mapcreate.addMarker({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
              title: 'Gekozen locatie',
              icon: icon
            });
          }
        });
        $(window).trigger('resize');
      }

    };
    var map;
    mapslogic.getMapOverview = function() {
      map = new GMaps({
        el: '#map',
        lat: 51.2194475,
        lng: 4.4024643,
        zoom: 13,
        streetViewControl: false,
        height: '90vh',
      });
    };
    mapslogic.addMarkerToMapOverview = function(glatitude, glongtitude, gprojectid, gprojectname, gprojectdescription) {
      var gprojectdescription = gprojectdescription.substring(0, 200);
      var gprojectname = gprojectname.substring(0, 40);
      var htmlcontent =        '<div>' +
      '<div class="card__content card__padding">' +
      '  <article class="card__article">' +
      '<h4><a href="/#/project/'+gprojectid+'">'+gprojectname+' ...</a></h4>' +

      '<p>'+gprojectdescription+' ...</p>' +
      '</article>' +

      '<div class="ReadMore">' +
      '<a href="/#/project/'+gprojectid+'">Lees meer...</a>' +
      '</div> </div> </div>' ;

      if (glatitude, glongtitude) {
        map.addMarker({
          lat: glatitude,
          lng: glongtitude,
          title: 'Project locatie',
          icon: icon,
          infoWindow: {
            content: htmlcontent,
            maxWidth: 300
          },
        });
      } else {
        console.log("nog geen locatie ingesteld");
      }

    };

    mapslogic.getMapSinglePage = function(latitude, longitude) {
      var spmap = new GMaps({
        el: '#spmap',
        lat: latitude,
        lng: longitude,
        streetViewControl: false,
        zoom: 15
      });

      spmap.removeMarkers();
      spmap.addMarker({
        lat: latitude,
        lng: longitude,
        title: 'Project locatie',
        icon : icon,
      });
    };

    var mapupdate;
    mapslogic.getMapUpdate = function() {
      if (mapupdate) {
        mapupdate.refresh;
        console.log("mapupdate bestaat al");
        $(window).trigger('resize');
      } else {
        console.log("mapupdate word gemaakt");
        mapupdate = new GMaps({
          el: '#mapupdate',
          lat: 51.2194475,
          lng: 4.4024643,
          zoom: 12,
          width: '100%' ,
          height: '400px',
          streetViewControl: false,
          click: function(e) {
            mapslogic.latupdate = e.latLng.lat();
            mapslogic.lngupdate = e.latLng.lng();
            console.log("lng = " + mapslogic.latupdate);
            console.log("lng = " + mapslogic.lngupdate);
            mapupdate.removeMarkers();
            mapupdate.addMarker({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
              title: 'Gekozen locatie',
              icon: icon
            });
          }
        });
        $(window).trigger('resize');
      }

    };

  });



})(jQuery);
