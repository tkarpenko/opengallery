describe('ogAuthRequestInterceptor ', function() {
  
  var httpProvider,
      ogAuthRequestInterceptor;



  beforeEach(function() {

    module('OpenGallery', function ($httpProvider) {
      httpProvider = $httpProvider;
    });

    inject(function(_ogAuthRequestInterceptor_) {
      ogAuthRequestInterceptor = _ogAuthRequestInterceptor_;
    });        
  });




  it('should have ogAuthRequestInterceptor be defined', function () {
    expect(ogAuthRequestInterceptor).toBeDefined();
  });



  it('should have the RequestService as an interceptor', function () {
    expect(httpProvider.interceptors).toContain('ogAuthRequestInterceptor');
  });


  // Test the adding the secret token to each request.
  // For test is using request to /api/v1/paintingtools in ogFilterDirective
  describe('should', function() {

    var $scope, 
        $compile, 
        $rootScope,
        $httpBackend,
        $templateCache,
        ogApiUrl,
        ogAuthService,
        ogPaintingToolsResource,
        template;



    beforeEach(function() {

      inject(function(_$compile_, 
                      _$rootScope_, 
                      _$httpBackend_,
                      _$templateCache_,
                      _ogApiUrl_,
                      _ogPaintingToolsResource_,
                      _ogAuthService_) {

        $compile                = _$compile_;
        $rootScope              = _$rootScope_;
        $httpBackend            = _$httpBackend_;
        $templateCache          = _$templateCache_;
        ogApiUrl                = _ogApiUrl_;
        ogAuthService           = _ogAuthService_;
        ogPaintingToolsResource = _ogPaintingToolsResource_;
      });


      $scope = $rootScope.$new();
      template = '<og-filter></og-filter>';
      template = $compile(template)($scope);
    });



    afterEach(function() {
      $scope.$digest();

      ogPaintingToolsResource.get();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });



    it("send headers['x-access-token'] with each request when user is logged in", function() {
      

      ogAuthService.login('artist_alias', 'someSecretToken');


      $httpBackend.expectGET(
        ogApiUrl + '/paintingtools',

        function(headers) {
          return headers['x-access-token'] === 'someSecretToken';
        }

      ).respond( 200, [ {value: 'oils', name: 'Oils', ptId: 1} ] );

    });



    it("not send headers['x-access-token'] with each request if no user is logged in", function() {

      
      ogAuthService.logout();


      $httpBackend.expectGET(
        ogApiUrl + '/paintingtools',

        function(headers) {
          return headers['x-access-token'] === undefined;
        }

      ).respond( 200,  [ {value: 'oils', name: 'Oils', ptId: 1} ] );

    });
  });
});