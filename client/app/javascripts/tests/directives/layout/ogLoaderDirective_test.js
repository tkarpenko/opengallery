describe('ogLoaderDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope, 
      template;



  beforeEach(function() {

    module('OpenGallery');
    template = "<og-loader></og-loader>";
    

    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);
      $scope.$digest();
    });
  });



  it('should provide HTML template with Loader', function() {
    expect(template[0].className).toContain('og_loader');
  });


  it('correctly switch Loader CSS classes.', function() {
    var innerScope = template.isolateScope();
    innerScope.$digest();

    innerScope.show = true;
    innerScope.$digest();
    expect(template[0].className).toContain('active');

    innerScope.show = false;
    innerScope.$digest();
    expect(template[0].className).not.toContain('active');

    innerScope.big = true;
    innerScope.$digest();
    expect(template[0].className).toContain('big');

    innerScope.big = false;
    innerScope.$digest();
    expect(template[0].className).not.toContain('big');
  });
});