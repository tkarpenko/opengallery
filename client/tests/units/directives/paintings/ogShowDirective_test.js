describe('ogShowDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope,
      $httpBackend,
      $templateCache,
      ogShowPaintingResource,
      ogApiUrl,
      template,
      promise;



  beforeEach(function() {
    var response;

    module('OpenGallery');
    
    inject(function(
                    _$compile_, 
                    _$rootScope_, 
                    _$httpBackend_,
                    _$templateCache_,
                    _ogApiUrl_,
                    _ogShowPaintingResource_
    ) { 
      $compile               = _$compile_;
      $rootScope             = _$rootScope_;
      $httpBackend           = _$httpBackend_;
      $templateCache         = _$templateCache_;
      ogApiUrl               = _ogApiUrl_;
      ogShowPaintingResource = _ogShowPaintingResource_;
      

      $scope = $rootScope.$new();
      template = $templateCache.get('views/paintings/show/og-show.html');
      template = $compile(template)($scope);

      $httpBackend.when('GET', ogApiUrl+'/paintings/show'
      ).respond(
        200, 
        {
          finded:      false
        }
      );


      $httpBackend.when('GET', ogApiUrl+"/paintings/show/1?filteredTools=oils"
      ).respond(
        200, 
        {
          author:     "Tania Karpenko", 
          description: "Horses on meadow in summer",
          fileName:    "/paintings/6864a745e1b43b00181d6f5ac2536ee7.jpg",
          title:       "Meadow",
          pId:         1,
          addedby:     "tania_karpenko",
          prevID:      "",
          nextID:      "2",
          finded:      true
        }
      );

      $scope.$digest();

      promise = ogShowPaintingResource.getShowInfo({pId: 1, filteredTools: ['oils']});
    });
  });



  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  it("should get array with paintings' full info from backend", function() {
    promise.$promise.then(function(data) {
      response = data;

      expect(data.author).toBe('Tania Karpenko');
      expect(data.description).toBe('Horses on meadow in summer');
      expect(data.fileName).toBe('/paintings/6864a745e1b43b00181d6f5ac2536ee7.jpg');
      expect(data.title).toBe('Meadow');
      expect(data.pId).toBe(1);
      expect(data.addedby).toBe('tania_karpenko');
      expect(data.prevID).toBe('');
      expect(data.nextID).toBe('2');
      expect(data.finded).toBe(true);
    });

    $httpBackend.flush();
  });


  it('should provide data from server to view', function() {
    promise.$promise.then(function(data) {
      $scope.painting = data;
    });
    $httpBackend.flush();
    $scope.$digest();

    var ogShowPaintingHTML = template[0].children[1].innerHTML;
    
    expect(ogShowPaintingHTML).toContain("painting_cover");
    expect(ogShowPaintingHTML).toContain("painting_menu");
    expect(ogShowPaintingHTML).toContain("painting_txt");
    expect(ogShowPaintingHTML).toContain("/paintings/6864a745e1b43b00181d6f5ac2536ee7.jpg");
    expect(ogShowPaintingHTML).toContain("#/painting/2");
    expect(ogShowPaintingHTML).toContain("Meadow");
    expect(ogShowPaintingHTML).toContain("Tania Karpenko");
    expect(ogShowPaintingHTML).toContain("Horses on meadow in summer");
    expect(ogShowPaintingHTML).toContain("tania_karpenko");
  });
});