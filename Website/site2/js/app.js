(function() {
  var app = angular.module('inspraakStad', ['view-templates', 'routesSelf']);

  app.controller("PanelController", function(){

    this.tab = 1;

    this.selectTab = function(setTab){
      this.tab = setTab;
    };

    this.isSelected = function(checkTab){
      return this.tab === checkTab;
    };
  });


})();
