describe('ogAddPaintingDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope,
      $httpBackend,
      $templateCache,
      ogApiUrl,
      template,
      promise,
      ogPaintingToolsResource;


  beforeEach(function() {

    module('OpenGallery');

    inject(function(_$compile_, 
                    _$rootScope_, 
                    _$httpBackend_,
                    _$templateCache_,
                    _ogApiUrl_,
                    _ogPaintingToolsResource_) {
      $compile                = _$compile_;
      $rootScope              = _$rootScope_;
      $httpBackend            = _$httpBackend_;
      $templateCache          = _$templateCache_;
      ogApiUrl                = _ogApiUrl_;
      ogPaintingToolsResource = _ogPaintingToolsResource_;
    });

    $scope = $rootScope.$new();
    template = $templateCache.get('views/paintings/add/index.html');
    template = $compile(template)($scope);
        

    $httpBackend.expectGET(ogApiUrl + '/paintingtools')
      .respond(
        200, 
        [ 
          {value: 'oils', name: 'Oils', ptId: 1},
          {value: 'pencils', name: 'Pencils', ptId: 3}, /*
          { ... },
          ...                                            */
        ]
      );
        
    $scope.$digest();

    promise = ogPaintingToolsResource.get();
  });



  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  describe('should get array with Painting Tools', function() {

    it('from backend', function() {
      promise.$promise.then(function(data) {
        expect(data[0].name).toBe('Oils');
        expect(data[1].name).toBe('Pencils');
      });

      $httpBackend.flush();
    });

    it('from backend and fill <select> with them', function() {

      $httpBackend.flush();
      $scope.$digest();

      var ogAddPaintingFormSelect = template[0].querySelectorAll('select')[0];
      
      expect(template[0].querySelectorAll('option').length).toBe(2);
      expect(ogAddPaintingFormSelect.innerHTML).toContain("<option");
      expect(ogAddPaintingFormSelect.innerHTML).toContain('label="Oils"');
      expect(ogAddPaintingFormSelect.innerHTML).toContain('label="Pencils"');
      
    });
  });


  describe('should', function() {
    
    beforeEach(function() {
      $httpBackend.flush();
    });


    describe('provide HTML template with', function() {
      var ogFormService;

      beforeEach(inject(function(_ogFormService_) {
        ogFormService = _ogFormService_;
      }));


      it('Add Painting Form.', function() {
        expect(template[0].querySelectorAll('form')[0].getAttribute('name')).toBe('addPForm');
        expect(template[0].querySelectorAll('.form_fieldset').length).toBe(6);
      });

      it('Tooltips for Add Painting form', function() {
        var tooltips = template[0].querySelectorAll('.og_tooltip');
        var form = template[0].querySelectorAll('form')[0];

        $scope.addPHelp = ogFormService.init(form);

        // Tooltips info
        expect(tooltips[0].innerHTML).toBe($scope.addPHelp.tooltip.addPTitle.msg);
        expect(tooltips[1].innerHTML).toBe($scope.addPHelp.tooltip.addPAuthor.msg);
        expect(tooltips[2].innerHTML).toBe($scope.addPHelp.tooltip.addPTool.msg);
        expect(tooltips[3].innerHTML).toBe($scope.addPHelp.tooltip.addPFile.msg);
        expect(tooltips[4].innerHTML).toBe($scope.addPHelp.tooltip.submit.msg);
      });
    });
      

    
    describe('work with backend:', function() {

      var $location,
          ogAddPaintingResource,
          addFormData = {
            pId:          11,
            title:        "New Painting",
            author:       "Author",
            tool:         "pastel",
            description:  "My new painting",
            addedBy:      "artist_alias",
            fileName:     "f1f1f1f1f1f1f1f11f1f1f1f.jpg",
            file:         new File([""], "image.jpg", {type: "image/jpg"})
          };


      beforeEach(function() {
        inject(function(_ogAddPaintingResource_, _$location_) {
          
          $location = _$location_;
          ogAddPaintingResource = _ogAddPaintingResource_;
        });



        $httpBackend.when('GET', ogApiUrl + '/confidential/paintings/add'
        ).respond( 200,  { 'pId': 10 } );


        var paintingData = new FormData();
        paintingData.append('pId', 11);
        paintingData.append('title', "New Painting");
        paintingData.append('author', "Author");
        paintingData.append('tool', "pastel");
        paintingData.append('description', "My new painting");
        paintingData.append('addedBy', "artist_alias");
        paintingData.append('fileName', "f1f1f1f1f1f1f1f11f1f1f1f.jpg");
        paintingData.append('file', new File([""], "image.jpg", {type: "image/jpg"}));

        $httpBackend.when('POST', ogApiUrl + '/confidential/paintings/add/11', paintingData
        ).respond( 200,  {success: 'Painting data saved successfully.'} );

        $scope.$digest();
      });


      
      afterEach(function() {
        $httpBackend.flush();
      });

    

      it('get ID of last painitng', function() {

        ogAddPaintingResource.getPrevPaintingID().$promise.then(function(data) {
          expect(data.pId).toBe(10);
        });

      });

      

      it('send data about new painting', function() {

        ogAddPaintingResource.getPrevPaintingID().$promise.then(function() {
          ogAddPaintingResource.save(addFormData).$promise.then(function(data) {

            expect(data.success).toBe('Painting data saved successfully.'); 

          });
        });
      });



      it('redirect to Gallery page when request was successful', function() {
        
        spyOn($location, 'path');
        jasmine.clock().install();


        ogAddPaintingResource.getPrevPaintingID().$promise.then(function() {
          ogAddPaintingResource.save(addFormData).$promise.then(function() {

            setTimeout(function() {
              $location.path('/');
            }, 2000);

            expect($location.path).not.toHaveBeenCalled();

            jasmine.clock().tick(2001);

            expect($location.path).toHaveBeenCalled();
                  
          });
        });
        
      });
    });
    


    it('call submit() function after submiting.', function() {
      spyOn($scope.addP, 'submit');

      var event = document.createEvent("UIEvent");
      event.initUIEvent("submit", true, true);
      template[0].querySelector('form').dispatchEvent(event);

      expect($scope.addP.submit).toHaveBeenCalled();
    });


    describe('check validity', function() {
      var addPForm;

      beforeEach(function() {
        addPForm = $scope.addPForm;
      });


      describe('of file', function() {
       

        it('type', function() {
          $scope.addP.file = new File([""], "file.jpg", {type: "image/jpg"});
          $scope.$digest();
          expect(addPForm.addPFile.$error.imageFile).toBeUndefined();

          $scope.addP.file = new File([""], "file.txt", {type: "text/plain"});
          $scope.$digest();
          expect(addPForm.addPFile.$error.imageFile).toBeTruthy();
        });


        it('presence', function() {
          $scope.addP.file = undefined;
          $scope.$digest();
          expect(addPForm.addPFile.$error.required).toBeTruthy();

          $scope.addP.file = new File([""], "file.jpg", {type: "image/jpg"});
          $scope.$digest();
          expect(addPForm.addPFile.$error.required).toBeUndefined();
        });
      });


      it('of title presence', function() {
        $scope.addP.title = '';
        $scope.$digest();
        expect(addPForm.addPTitle.$error.required).toBeTruthy();

        $scope.addP.title = 't';
        $scope.$digest();
        expect(addPForm.addPTitle.$error.required).toBeUndefined();
      });


      it('of author presence', function() {
        $scope.addP.author = '';
        $scope.$digest();
        expect(addPForm.addPAuthor.$error.required).toBeTruthy();

        $scope.addP.author = 'a';
        $scope.$digest();
        expect(addPForm.addPAuthor.$error.required).toBeUndefined();
      });
    });
  });

});
