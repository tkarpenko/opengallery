/**
  ogGalleryDirective controls 
  1) the appearence of Paintings' Previews
  2) the activity of Filter (is it visible and active or not)
*/
angular.module('ogDirectives').directive('ogGallery', 
  ['ogPreviewPaintingsResource', 'ogFilterStateService', '$filter', '$rootScope',
  
  function(
    ogPreviewPaintingsResource,    // Resource for request to server
    ogFilterStateService,          // Controls the Filter's state (which Filter's items are on/off)
    $filter,
    $rootScope
  ) {
  return {
    restrict: 'AE',
    link: function(scope) {

      // From the very beginning the Loader is shown
      // till server responses to the request 
      scope.isLoading = true;

      // Event to notify Filter directive that Filter is visible and enable now
      $rootScope.$broadcast('filterActive', true);



      // Make request to get array with objects of Paintings' info
      var paintings = ogPreviewPaintingsResource.getPaintings(function(response) {
        response.$promise.then(

          // If response is successful
          function() {

            // After getting the successful response hide the Loader
            scope.isLoading = false;

            // If there is at least one painting
            if (paintings[0].pId > 0) {

              // then filter Paintings on Gallery page by Painting Tools 
              // that are activated with Filter           
              scope.paintings = $filter('filter')(paintings, filterByTools(ogFilterStateService.toolsStates));;
            } else {
              // TODO Notification service
            }
          },

          // If response is failed log it
          function(error) {
            console.log('Error on server: ' + error.status + ': ' + error.data.error);
          });
      });



      // If any Filter's Item changes its state
      // then filter Paintings on Gallery page again by Painting Tools
      // that are activated with Filter 
      scope.$on('filterUpdated', function() {
        scope.paintings = $filter('filter')(paintings, filterByTools(ogFilterStateService.toolsStates));
        scope.$apply();
      });


      // When artist leaving Gallery page
      // the event fires to notify Filter directive that it is hidden
      scope.$on('$destroy', function() {
        $rootScope.$broadcast('filterActive', false);
      });



      /**
        Private functions
      */

      // Return the state of Filter's Item (specific Painting Tool)
      // for current Painting in which this Painting was painted.
      // If all Filter's Items are off then return true for all Paintings/
      function filterByTools (tools) {
        return function(painting) {
          if ( isThereActiveTool(tools) ) {
            return tools[painting.toolValue];
          }
          return true;
        };
      }; 

      // Return answer for the question: 
      // is there any active Item in Filter
      function isThereActiveTool(tools) {
        for (var tool in tools) {
          if ( tools[tool] ) {
            return true;
          }
        }
        return false;
      }
    }
  };
}]);
