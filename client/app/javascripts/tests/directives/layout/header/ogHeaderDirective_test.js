describe('ogHeaderDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope,
      $httpBackend,
      ogApiUrl, 
      template;



  beforeEach(function() {

    module('OpenGallery');
    template = "<og-header></og-header>";
    

    inject(function(_$compile_, _$rootScope_, _$httpBackend_, _ogApiUrl_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      ogApiUrl = _ogApiUrl_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);

      $httpBackend.expectGET(ogApiUrl + '/paintingtools')
        .respond(
          200, 
          [ 
            {value: 'oils', name: 'Oils', ptId: 1}, /*
            { ... },
            ...                                     */
          ]
        );
        
      $scope.$digest();
    });
  });



  it('should provide HTML template with Header', function() {
    expect(template[0].className).toContain('og_header');
  });
});