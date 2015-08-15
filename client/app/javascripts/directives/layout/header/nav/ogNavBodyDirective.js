/**
  Provide the Navigation Items' list
*/
angular.module('ogDirectives').directive('ogNavBody', function() {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'views/layout/header/nav/og-nav-body.html',
    scope: {
      loggedin: '=',    // flag to figure out what item to show: "Sign In" or "Sign Out"
      logout: '='       // link to logout function in parent directive (ogNavDirective)
    }
  };
});