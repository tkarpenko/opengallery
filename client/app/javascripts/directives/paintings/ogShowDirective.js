/**
  ogShowDirective controls 
  1) the full info of current Painting. 
     If Painting is found in DB it provides to the view.
     Else browser loads Gallery page
  2) the disabling of Filter. It is visible but is disabled on Show Painting page
*/
angular.module('ogDirectives').directive('ogShow', 
  ['ogShowPaintingResource', 'ogFilterStateService', '$routeParams', '$location', '$rootScope',
  
  function(
    ogShowPaintingResource,  // Resource for request to server
    ogFilterStateService,    // Controls the Filter's state (which Filter's items are on/off)
    $routeParams,
    $location, 
    $rootScope
  ) {
  return {
    restrict: 'AE',
    link: function(scope) {

      // From the very beginning the Loader is shown
      // till server responses to the request 
      scope.isLoading = true;

      // Event to notify Filter directive
      // that Filter is visible but disabled (frozen) now
      $rootScope.$broadcast('filterFrozen', true);



      // Prepare data with tools for filtering for request
      /* 
        for instance, of next Filter state:
        {
          'oils': false, 
          'pencils': true, 
          'pastel': true, 
          'gouache': false, 
          'camera': false
        }
        to the server will send next array:
        [ 'oils', 'pastel' ]
      */
      var activeToolsNames = replaceActiveToArray(ogFilterStateService.toolsStates);

      // Make request to get array with objects of Paintings' full info
      var painting = ogShowPaintingResource.getShowInfo(
        
        // GET-request Params: 
        // 1) ID in DB of current Painting
        // 2) array with Painting Tools for filtering
        {
          pId: $routeParams.pId,
          filteredTools: activeToolsNames
        }, 
        function(response) {
          response.$promise.then(

            // If response is successful
            function() {

              // and there is Painting in DB with appropriate ID
              // then provide data to the view
              if (painting.finded) {
                scope.painting = painting;

              // if there is no requested Painting in DB
              // then redirect to Gallery page
              } else {
                $location.path('/');
              }

              // After getting the successful response hide the Loader
              scope.isLoading = false;
            },

            // If response is failed log it
            function(err) {
              console.log('Some problems on server: '+err.status+': '+err.data.error);
            }
          );
      });


      // When artist leaving Show Painting page 
      // the event fires to notify Filter directive that it is hidden
      scope.$on('$destroy', function() {
        $rootScope.$broadcast('filterFrozen', false);
      });



      /**
        Private function
      */

      /* 
        replaceActiveToArray get an object with Filter's state
        for instance:
        {
          'oils': false, 
          'pencils': true, 
          'pastel': true, 
          'gouache': false, 
          'camera': false
        }
        and return array with only active Filter's Items
        in our case:
        [
          'oils'   ,
          'pastel'
        ]
      */
      function replaceActiveToArray(activeTools) {
        var activeToolsNames = [];

        for (var tool in activeTools) {
          if (activeTools[tool]) {
            activeToolsNames.push(tool);
          }
        }

        return activeToolsNames;
      }
    }
  };
}]);