/**
  ogNavDirective controls the child directives' behaviour
  1) controls the title of the Navigation
  2) controls the visibility of "Log In", "Log Out" Navigation Items
*/
angular.module('ogDirectives').directive('ogNav', 
  ['ogAuthService', 

  function(
    ogAuthService    // keeps information about current authorization, if authorization is
                     // and provides methods to work with authorization info
  ) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'views/layout/header/nav/og-nav.html',

    link: function(scope) {
      scope.nav = {

        // If Artist is loggedin then show his/her alias
        // and hide "Sign In" Navigation Item
        // and show "Sign Out" Navigation Item
        loggedin: ogAuthService.isLoggedIn,
        alias:    ogAuthService.isLoggedIn ? ogAuthService.getArtist() : "Gallery Menu",
        logout:   function() {
          ogAuthService.logout();
        }
      };
      

      // Watch any changes with authorization info: 
      // is artist logged or logged out and if it is so 
      // update Navigation Menu in appropriate way
      scope.$watch(
        function() { return ogAuthService.isLoggedIn; }, 
        function() {
          scope.nav.loggedin = ogAuthService.isLoggedIn;
          scope.nav.alias    = ogAuthService.isLoggedIn ? ogAuthService.getArtist() : "Gallery Menu";
        }
      ,true);
    }
  };
}]);