/**
  ogLoaderDirective controls the behavior of Loader
  1) when it is visible
  2) when it is big and when it is small
*/
angular.module('ogDirectives').directive('ogLoader', function() {
  return {
    restrict: 'AE',
    templateUrl: 'views/layout/og-loader.html',
    replace: true,
    scope: {
      show: '=',
      big: '='
    }
  };
});