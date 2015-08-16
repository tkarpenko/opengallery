describe('ogPreviewPaintingDirective ', function() {

  var $scope,
      $compile,
      $rootScope,
      template;


  beforeEach(function() {

    module('OpenGallery');
    template = '<og-preview-painting></og-preview-painting>';
    
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);
      $scope.$digest();
    })
  });


  it('should provide HTML template with Preview Painting', function() {
    expect(template[0].innerHTML).toContain('painting_hover');
    expect(template[0].innerHTML).toContain('painting_details');
  });
});