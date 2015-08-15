angular.module('ogResources').factory('ogShowPaintingResource', 
  ['ogApiUrl', '$resource', 
  
  function(
    ogApiUrl,
    $resource 
  ) {
    return $resource( ogApiUrl+'/paintings/show/:pId', {pId: '@pId'},
      {
        getShowInfo: {
          method: 'GET',
          cache: true
        }
      }
    );
}]);