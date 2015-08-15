/**
  ogFilterItemsDirective controls the activety 
  of each Filter's Item (the specific Painting Tool) and its appearance
*/
angular.module('ogDirectives').directive('ogFilterItems', 
  ['ogFilterStateService', 

  function(
    ogFilterStateService     // Controls the Filter's state (which Filter's items are on/off)
  ) {
  return {
    restrict: 'AE',
    templateUrl: 'views/filter/og-filter-items.html',
    replace: true,
    scope: {
      tool: '='
    },

    link: function(scope, elem) {

      // Controls the Filter's Item's "Active" CSS-class.
      scope.isToolActive = function() {
        return ogFilterStateService.isToolActive(scope.tool.value);
      }



      // Controls the Filter's Item state
      var toggleButton = elem[0].querySelector('button');

      // Filter's Item is activated (or disactivated again) 
      // by cliking on appropriate button
      toggleButton.addEventListener('click', function (event) {
        ogFilterStateService.toggleTool(scope.tool.value);
      });



      // If "Show of Painting" page is current now then 
      // each Filter's Item is disabled
      scope.$on('filterFrozen', function(event, isFrozen) {
        toggleButton.disabled = isFrozen;
      });
    }
  };
}]);