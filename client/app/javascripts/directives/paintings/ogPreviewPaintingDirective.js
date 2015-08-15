/**
  Provides the HTML code for preview of one Painting
  and transfer painting info to the view.
*/
angular.module('ogDirectives').directive('ogPreviewPainting', function() {
  return {
    restrict: 'AE',
    templateUrl: 'views/paintings/preview/og-preview-painting.html',
    replace: true,
    scope: {
      painting: '='    // Object with info of Painting Preview
    }
  };
});