/**
  ogHeaderDirective provides HTML template with app's header
*/
angular.module('ogDirectives').directive('ogHeader', function() {
  return {
    restrict: 'AE',
    templateUrl: 'views/layout/header/og-header.html',
    replace: true
  };
});