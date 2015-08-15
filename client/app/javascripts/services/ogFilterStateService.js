/**
  ogFilterStateService keeps variables and provides methods 
  for controls the Filter's Items state.
  Filter's Items are specific Painting Tool
*/
angular.module('ogServices').factory('ogFilterStateService', 
  ['$rootScope', 

  function(
    $rootScope
  ) {
  var service = {

    // private variable 
    // keeps each Item state (on/off = true/false)
    toolsStates: {},

    // return the state of specific Item 
    isToolActive: function(tool) {
      return service.toolsStates[tool];
    },

    // toggle the state of specific Item
    // and fire event for ogGalleryDirective
    // for update visible array with paintings' previews 
    toggleTool: function(tool) {
      service.toolsStates[tool] = !service.toolsStates[tool];
      $rootScope.$broadcast('filterUpdated', true);
    },

    // fill the toolsStates variable.
    // If browser was refreshed then initTools() fills the toolsStates 
    // with data of last Filter state stored in sessionStorage
    initTools: function(tools) {
      if (window.sessionStorage.filterToolsStates) {
        service.toolsStates = JSON.parse(window.sessionStorage.filterToolsStates);

      } else {
        
        for (var i = 0; i < tools.length; i++) {
          service.toolsStates[ tools[i].value ] = false;
        }
      }
    },

    // When 'onbeforeunload' or 'filterUpdated' events are fired
    // saveState() saves current Filter state to sessionStorage
    // as string
    saveState: function () {
      window.sessionStorage.filterToolsStates = JSON.stringify(service.toolsStates);
    },
  };

  $rootScope.$on('saveFilterState', service.saveState);
  $rootScope.$on('filterUpdated',   service.saveState);
  $rootScope.$on('restoreFilterState', service.initTools);

  return service;
}]);




/**
  With each browser refresh fire the event 'saveFilterState'
  to save current filter state
*/
angular.module('ogServices').run(['$rootScope', function($rootScope) {
  window.onbeforeunload = function (event) {
    $rootScope.$broadcast('saveFilterState');
  };
}]);