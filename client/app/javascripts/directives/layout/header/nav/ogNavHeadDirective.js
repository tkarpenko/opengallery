/**
  Provides the Navigation title. It can be or artist's alias or phrase "Gallery Menu".
*/
angular.module('ogDirectives').directive('ogNavHead', function() {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'views/layout/header/nav/og-nav-head.html',
    scope: {
      alias: '='
    }
  };
});