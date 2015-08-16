describe('ogFilterDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope,
      $httpBackend,
      ogPaintingToolsResource,
      ogApiUrl, 
      template,
      promise;



  beforeEach(function() {
    module('OpenGallery');
    template = "<og-filter></og-filter>";
    
    inject(function(_$compile_, 
                    _$rootScope_, 
                    _$httpBackend_,
                    _ogPaintingToolsResource_,
                    _ogApiUrl_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      ogApiUrl = _ogApiUrl_;
      ogPaintingToolsResource = _ogPaintingToolsResource_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);


      $httpBackend.expectGET(ogApiUrl + '/paintingtools').respond(
        200, 
        [
          {value: 'oils', name: 'Oils', ptId: 1},
          {value: 'pencils', name: 'Pencils', ptId: 3}, /*
          { ... },
          ...                                            */
        ]
      );

      $scope.$digest();
    });
  });




  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });




  it('should provide to view the array with painting tools from backend', function() {
    var response;
    promise = ogPaintingToolsResource.get();
    
    promise.$promise.then(function(data) {
      response = data;
      expect(data[0].name).toBe('Oils');
      expect(data[1].name).toBe('Pencils');
    });
    $httpBackend.flush();

    expect(response[0].value).toEqual($scope.paintingTools[0].value);
    expect(response[0].name).toEqual($scope.paintingTools[0].name);
    expect(response[0].ptId).toEqual($scope.paintingTools[0].ptId);

    expect(response[1].value).toEqual($scope.paintingTools[1].value);
    expect(response[1].name).toEqual($scope.paintingTools[1].name);
    expect(response[1].ptId).toEqual($scope.paintingTools[1].ptId);
  });



  describe('should', function() {


    beforeEach(function() {
      promise = ogPaintingToolsResource.get();
      $httpBackend.flush();
    });



    it('provide HTML template with toggle button and list for painting tools.', function() {
      expect(template[0].querySelectorAll('ul').length).toBe(1);
      expect(template[0].querySelectorAll('button.filter_smsc').length).toBe(1);
    });


    it('correctly switch filter CSS classes.', function() {
      $scope.mobileFilterOpen = true;
      $scope.$digest();
      expect(template[0].className).toContain('mobile_open');

      $scope.mobileFilterOpen = false;
      $scope.$digest();
      expect(template[0].className).not.toContain('mobile_open');

      $scope.isActive = true;
      $scope.$digest();
      expect(template[0].className).toContain('active');

      $scope.isActive = false;
      $scope.$digest();
      expect(template[0].className).not.toContain('active');

      $scope.isFrozen = true;
      $scope.$digest();
      expect(template[0].className).toContain('frozen');

      $scope.isFrozen = false;
      $scope.$digest();
      expect(template[0].className).not.toContain('frozen');
    });


    it('react on click on Filter Open/Hide Button (for mobile css)', function() {
      expect($scope.mobileFilterOpen).toBeFalsy();

      var event = document.createEvent("MouseEvent");
      event.initMouseEvent("click", true, true);
      template[0].children[0].dispatchEvent(event);

      expect($scope.mobileFilterOpen).toBeTruthy();
    });


    it("create DOM <ul>'s list length equal to length of array from backend", function() {
      expect(template[0].children[1].children.length - 1).toEqual($scope.paintingTools.length);
    });
  });
});