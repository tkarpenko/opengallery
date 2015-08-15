angular.module('ogResources').factory('ogLoginResource', 
  ['ogApiUrl', '$resource', 
  
  function(
    ogApiUrl,
    $resource 
  ) {
  return $resource( ogApiUrl+'/auth/login/:alias', {alias: '@alias'},
    {
      getPass: {method: 'GET'}
    }
  );
}]);