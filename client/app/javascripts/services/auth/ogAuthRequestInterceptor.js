/**
  ogAuthRequestInterceptor triggers all time 
  before the  request is sending to server
*/
angular.module('ogServices').factory('ogAuthRequestInterceptor', 
  ['ogAuthService', 
  
  function(
    ogAuthService   // Provides variables and methods for working up with auth info
  ) {  
  var ogAuthRequestInterceptor = {
    request: function(config) {

      if (ogAuthService.isLoggedIn) {
          config.headers['x-access-token'] = ogAuthService.getToken();
      }
      
      return config;
    }
  };
  return ogAuthRequestInterceptor;
}]);