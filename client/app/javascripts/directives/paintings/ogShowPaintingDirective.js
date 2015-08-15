/**
  ogShowPaintingDirective provides HTML template for showing
  full info about current Painting
*/
angular.module('ogDirectives').directive('ogShowPainting', function() {
  return {
    restrict: 'AE',
    templateUrl: 'views/paintings/show/og-show-painting.html',
    replace: true,
    scope: {
      painting: '='    // Object with full info of current Painting
    }
  };
});