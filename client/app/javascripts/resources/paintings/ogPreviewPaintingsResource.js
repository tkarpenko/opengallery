angular.module('ogResources').factory('ogPreviewPaintingsResource', 
  ['ogApiUrl', '$resource', '$cacheFactory',
  
  function(
    ogApiUrl,
    $resource,
    $cacheFactory
  ) {
    return $resource( ogApiUrl+'/paintings/preview', null,
      {
        getPaintings: {
          method:  'GET', 
          isArray: true,

          // For array with preview info about all paintings 
          // will be created individual cache. 
          // It will be cleaned all time after saving new Painting
          cache:   $cacheFactory('/paintings/preview')
        }
      }
    );
}]);