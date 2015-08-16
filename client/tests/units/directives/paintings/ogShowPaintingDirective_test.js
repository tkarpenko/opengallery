describe('ogShowPaintingDirective ', function() {

  var $scope,
      $compile,
      $rootScope,
      template;


  beforeEach(function() {

    module('OpenGallery');
    template = '<og-show-painting></og-show-painting>';
    
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);
      $scope.$digest();
    })
  });


  it('should provide HTML template with Preview Painting', function() {
    expect(template[0].innerHTML).toContain('painting_cover');
    expect(template[0].innerHTML).toContain('painting_menu');
    expect(template[0].innerHTML).toContain('painting_txt');
  });
});