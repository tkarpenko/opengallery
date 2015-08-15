/**
  ogAuth is parent derictive for ogLogin and ogRegistration directives
  It manages
    1) what title of the page will be display on screen
    2) what form (Login or Registration) will be display on screen
*/
angular.module('ogDirectives').directive('ogAuth', 
  ['ogAuthService',
  
  function(
    ogAuthService        // ogAuthService provides variable formRegistration 
                         // which shows what auth form the user has chosen  
  ) {
  return {
    restrict: 'AE',
    link: function(scope) {
      scope.title = ogAuthService.formRegistration ? 'Registration' : 'Login';
      scope.newArtist = ogAuthService.formRegistration;
    }
  };
}]);