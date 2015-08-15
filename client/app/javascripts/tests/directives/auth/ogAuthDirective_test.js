describe('ogAuthDirective ', function() {
  var $scope, 
      $compile,
      $rootScope,
      $templateCache,
      template;

  beforeEach(function() {
    module('OpenGallery');

    inject(function(_$compile_, _$rootScope_, _$templateCache_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $templateCache = _$templateCache_;

      $scope = $rootScope.$new();
      template = $templateCache.get('views/auth/og-auth.html');
      template = $compile(template)($scope);
    });
  });


  it('hould display directive scope variables.', function() {
    $scope.title = 'Some Word';
    $scope.$digest();
    expect($(template[0].children[0]).text()).toBe('Some Word');
  });

  it ('should display Login or Register HTML form according to conditions', function(){
    $scope.newArtist = true;
    $scope.$digest();
    var formName = template[0].children[1].getAttribute('name');

    expect(formName).toBe("regForm");
    expect(formName).not.toBe("loginForm");


    $scope.newArtist = false;
    $scope.$digest();
    formName = template[0].children[1].getAttribute('name');
    
    expect(formName).toBe("loginForm");
    expect(formName).not.toBe("regForm");

  });
});
