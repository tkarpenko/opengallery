/**
  Filter filters Paintings on Gallery page by painting tool
  in which Painting was painted (oils, pencils, gouache, ...)
*/
angular.module('ogDirectives').directive('ogFilter', 
  ['ogPaintingToolsResource', 'ogFilterStateService',
  
  function(
    ogPaintingToolsResource,   // Resource for request for Paintings Tools to server
    ogFilterStateService       // Controls the Filter's state (which Filter's items are on/off)
  ) {
  return {
    restrict: 'AE',
    templateUrl: 'views/filter/og-filter.html',
    replace: true,

    link: function(scope, elem) {

      /**
        Controls the Filter's css classes by listening
        of AngularJS Events.
      */

      // filterFrozen event sends from ogShowPaintingDiretive.
      // When page of Show of filtered paintings is current now
      // we can't change filter state, we an only see its current state
      scope.$on('filterFrozen', function(event, isFrozen) {
        scope.isFrozen = isFrozen;
      });

      // filterActive event sends from ogGalleryDirective.
      // When page of Gallery is current now
      // we can change its state - we can .
      // otherwise, we can't see Filter at all
      scope.$on('filterActive', function(event, isActive) {
        scope.isActive = isActive;
      });



      /**
        Controls the Filter's visibility on mobile screen.
      */

      // From the verry beginning Filter is closed
      if( scope.mobileFilterOpen === undefined ) {
        scope.mobileFilterOpen = false;
      }

      var mobileToggleButton = elem[0].querySelector('button.filter_smsc');

      // Filter is opened (or closed again) after cliking on appropriate button
      mobileToggleButton.addEventListener('click', function() {
        scope.mobileFilterOpen = !scope.mobileFilterOpen;
        scope.$apply();
      });



      /**
        Get array of available Painting Tools from server
      */
      var paintingTools = ogPaintingToolsResource.get(function(response) {
        response.$promise.then(
          
          // If array with Painting Tools info was sended by server
          function() {
            scope.paintingTools = paintingTools;

            // From the very beginning set the Filter's state
            // of all available Panting Tools to 'off' (false)
            ogFilterStateService.initTools(paintingTools);
          },

          // Else some error was happend
          function(err) {
            console.log('Error on server: ' + err.status + ': ' + err.data.error);
          }
        );
      });
    }
  };
}]);