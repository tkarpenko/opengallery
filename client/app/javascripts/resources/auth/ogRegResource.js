angular.module('ogResources').factory('ogRegResource', 
  ['ogApiUrl', '$resource', 
  
  function(
    ogApiUrl,
    $resource 
  ) {
  return $resource( ogApiUrl+'/auth/registration', null,
    {
      isUnique: {
        method: 'GET',
        url: ogApiUrl+'/auth/registration/:alias',
        params: {alias: '@alias'}
      }
    }
  );
}]);