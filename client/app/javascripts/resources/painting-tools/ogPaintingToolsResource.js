angular.module('ogResources').factory('ogPaintingToolsResource',
  ['ogApiUrl', '$resource', 
  
  function(
    ogApiUrl,
    $resource 
  ) {
  return $resource( ogApiUrl+'/paintingtools', null, {
      get: {
        method: 'GET',
        isArray: true,
        cache: true
      }
    }
  );
}]);