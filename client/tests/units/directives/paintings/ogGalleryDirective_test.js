describe('ogGalleryDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope,
      $httpBackend,
      $templateCache,
      ogPreviewPaintingsResource,
      ogApiUrl,
      template,
      promise,
      $route,
      $location;



  beforeEach(function() {
    var response;

    module('OpenGallery');
    
    inject(function(
                    _$compile_, 
                    _$rootScope_, 
                    _$httpBackend_,
                    _$templateCache_,
                    _ogApiUrl_,
                    _ogPreviewPaintingsResource_,
                    _$route_,
                    _$location_
    ) { 
      $compile                   = _$compile_;
      $rootScope                 = _$rootScope_;
      $httpBackend               = _$httpBackend_;
      $templateCache             = _$templateCache_;
      ogApiUrl                   = _ogApiUrl_;
      ogPreviewPaintingsResource = _ogPreviewPaintingsResource_;

      $route = _$route_;
      $location = _$location_;

      $scope = $rootScope.$new();
      template = $templateCache.get('views/paintings/preview/index.html');
      template = $compile(template)($scope);


      $httpBackend.expectGET(ogApiUrl+'/paintings/preview').respond(
        200, 
        [
          {
            author:     "Tania Karpenko", 
            description: "Horses on meadow in summer",
            fileName:    "/paintings/6864a745e1b43b00181d6f5ac2536ee7.jpg",
            title:       "Meadow",
            pId:         1,
            toolValue:   "oils",
            toolName:    "Oils"
          },                        /*
          {
            ...
          },
          ...                       */
        ]
      );

      $scope.$digest();

    });
    promise = ogPreviewPaintingsResource.getPaintings();
  });



  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  it("should get array with paintings' previews from backend", function() {
    promise.$promise.then(function(data) {
      response = data;
      expect(data[0].author).toBe('Tania Karpenko');
      expect(data[0].description).toBe('Horses on meadow in summer');
      expect(data[0].fileName).toBe('/paintings/6864a745e1b43b00181d6f5ac2536ee7.jpg');
      expect(data[0].title).toBe('Meadow');
      expect(data[0].pId).toBe(1);
      expect(data[0].toolValue).toBe('oils');
      expect(data[0].toolName).toBe('Oils');
    });

    $httpBackend.flush();
  });

  it('should provide data from server to children directive ogPreviewPaintingDirective', function() {
    $httpBackend.flush();
    $scope.$digest();

    var ogPreviewPaintingHTML = template[1].children[0].innerHTML;

    expect(ogPreviewPaintingHTML).toContain("painting_cover");
    expect(ogPreviewPaintingHTML).toContain("/paintings/6864a745e1b43b00181d6f5ac2536ee7.jpg");
    expect(ogPreviewPaintingHTML).toContain("painting_view_btn");
    expect(ogPreviewPaintingHTML).toContain("#/painting/1");
    expect(ogPreviewPaintingHTML).toContain("Meadow");
    expect(ogPreviewPaintingHTML).toContain("Tania Karpenko");
    expect(ogPreviewPaintingHTML).toContain("glyphicon glyphicon-oils");
  });
});