describe('ogNavHeadDirective', function() {

  var $scope,
      $compile,
      $rootScope,
      template;



  beforeEach(function() {
    
    module('OpenGallery');
    template = '<og-nav-head></og-nav-head>';
    
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);
      $scope.$digest();
    })
  });


  it('should provide HTML template with Navigation Title', function() {
    expect(template[0].className).toContain('nav_head');
  });
});