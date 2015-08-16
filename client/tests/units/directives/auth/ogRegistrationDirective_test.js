describe('ogRegistrationDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope, 
      template;

  beforeEach(function() {
    module('OpenGallery');
    template = "<og-registration></og-registration>";

    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);
      $scope.$digest();
    });
  });


  describe('should provide HTML template with', function() {
    var ogFormService;

    beforeEach(inject(function(_ogFormService_) {
      ogFormService = _ogFormService_;
    }));


    it('Registration Form.', function() {
      expect(template[0].getAttribute('name')).toBe('regForm');
      expect(template[0].querySelectorAll('input').length).toBe(4);
    });

    it('Tooltips and Input Patterns for Registration form', function() {
      var tooltips = template[0].querySelectorAll('.og_tooltip'),
          inputs   = template[0].querySelectorAll('input');

      $scope.regHelp = ogFormService.init(template[0]);

      // Tooltips info
      expect(tooltips[0].innerHTML).toBe($scope.regHelp.tooltip.alias.msg);
      expect(tooltips[1].innerHTML).toBe($scope.regHelp.tooltip.email.msg);
      expect(tooltips[2].innerHTML).toBe($scope.regHelp.tooltip.password.msg);
      expect(tooltips[3].innerHTML).toBe($scope.regHelp.tooltip.confPassword.msg);
      expect(tooltips[4].innerHTML).toBe($scope.regHelp.tooltip.submit.msg);

      // Input patterns for next validation
      expect(inputs[1].getAttribute('ng-pattern')).toBe($scope.regHelp.pattern.email+'');
      expect(inputs[2].getAttribute('ng-pattern')).toBe($scope.regHelp.pattern.oneWord+'');
      expect(inputs[3].getAttribute('ng-pattern')).toBe($scope.regHelp.pattern.oneWord+'');
    });
  });
    


  describe('should to send', function() {
    var $httpBackend,
        ogApiUrl,
        ogRegResource,
        promise;

    beforeEach(function() {
      inject(function(_ogRegResource_, _ogApiUrl_, _$httpBackend_) {
        
        $httpBackend = _$httpBackend_;
        ogRegResource = _ogRegResource_;
        ogApiUrl = _ogApiUrl_;
      });

      $httpBackend.expectPOST(ogApiUrl + '/auth/registration', 
        {
          email: 'test@test.com',
          alias: 'test_user',
          pass:  'pa$$word'
        }
      ).respond(
        201, 
        {
          alias: 'test_user',
          token: 'xxx' 
        }
      );

      promise = ogRegResource.save(
        {
          email: 'test@test.com',
          alias: 'test_user',
          pass:  'pa$$word'
        });
    });


    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    it('registing data to backend', function() {
      promise.$promise.then(function(data) {
        expect(data.alias).toBe('test_user');
      });

      $httpBackend.flush();
    });
  });



  describe('should call', function() {
    var innerScope;

    beforeEach(function() {
      innerScope = template.isolateScope();
      innerScope.$digest();
    });


    it('goLogin() function after clicking on link "Already a member".', function() {
      spyOn(innerScope.reg, 'goLogin');

      var event = document.createEvent("MouseEvent");
      event.initMouseEvent("click", true, true);
      template[0].children[5].children[0].dispatchEvent(event);
    
      expect(innerScope.reg.goLogin).toHaveBeenCalled();
    });


    it('submit() function after submiting.', function() {
      spyOn(innerScope.reg, 'submit');

      var event = document.createEvent("UIEvent");
      event.initUIEvent("submit", true, true);
      template[0].dispatchEvent(event);

      expect(innerScope.reg.submit).toHaveBeenCalled();
    });
  });



  describe('should check validity', function() {
    var innerScope,
        regForm;

    beforeEach(function() {
      innerScope = template.isolateScope();
      innerScope.$digest();

      regForm = innerScope.regForm;
    });


    describe('of alias', function() {
      var $httpBackend, ogApiUrl;
      
      beforeEach(inject(function(_ogApiUrl_, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        ogApiUrl = _ogApiUrl_;
      }));


      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });


      describe('uniqueness', function() {
        it('when it is unique', function() {
          $httpBackend.expectGET(ogApiUrl + '/auth/registration/test_alias')
          .respond(200, { unique: true } );

          innerScope.reg.alias = 'test_alias';
          innerScope.$digest();

          $httpBackend.flush();
          expect(regForm.alias.$error.unique).toBeUndefined();
        });

        it ('when it is not unique', function() {
          $httpBackend.expectGET(ogApiUrl + '/auth/registration/test_another_alias')
          .respond(200, { unique: false } );

          innerScope.reg.alias = 'test_another_alias';
          innerScope.$digest();

          $httpBackend.flush();
          expect(regForm.alias.$error.unique).toBeTruthy();

        });
      });


      describe('length', function() {
        it('when it is too small', function() {
          innerScope.reg.alias = 'te';
          innerScope.$digest();
          expect(regForm.alias.$error.minlength).toBeTruthy();
        });

        it('when it is normal', function() {
          $httpBackend.expectGET(ogApiUrl + '/auth/registration/test_alias')
          .respond(200, { unique: true } );

          innerScope.reg.alias = 'test_alias';
          innerScope.$digest();

          $httpBackend.flush();
          expect(regForm.alias.$error.maxlength).toBeUndefined();
        });

        it('when it is too long', function() {
          innerScope.reg.alias = 'test_user_test_user_l';
          innerScope.$digest();
          expect(regForm.alias.$error.maxlength).toBeTruthy();
        });
      });

      describe('equality', function() {
        var ogFormPatternsService;

        beforeEach(inject(function(_ogFormPatternsService_) {
          ogFormPatternsService = _ogFormPatternsService_;
        }));


        it('to pattern', function() {
          innerScope.reg.alias = 'te';
          innerScope.$digest();
          ogFormPatternsService.oneWord.test(innerScope.reg.alias);
          expect(regForm.alias.$error.pattern).toBeUndefined();
          
          innerScope.reg.alias = 'te/';
          innerScope.$digest();
          ogFormPatternsService.oneWord.test(innerScope.reg.alias);
          expect(regForm.alias.$error.pattern).toBeTruthy();
        });
      });
    });

    
    describe('of email', function() {
      describe('equality', function() {
        var ogFormPatternsService;

        beforeEach(inject(function(_ogFormPatternsService_) {
          ogFormPatternsService = _ogFormPatternsService_;
        }));


        it('to pattern', function() {
          innerScope.reg.email = 'test@email.com';
          innerScope.$digest();
          ogFormPatternsService.email.test(innerScope.reg.email);
          expect(regForm.email.$error.pattern).toBeUndefined();

          innerScope.reg.email = 'test_email';
          innerScope.$digest();
          ogFormPatternsService.email.test(innerScope.reg.email);
          expect(regForm.email.$error.pattern).toBeTruthy();
        });
      });

      it('field filling', function() {
        innerScope.reg.email = '';
        innerScope.$digest();
        expect(regForm.email.$error.required).toBeTruthy();

        innerScope.reg.email = 'test@email.com';
        innerScope.$digest();
        expect(regForm.email.$error.required).toBeUndefined();
      });
    });

    
    describe('of password', function() {
      describe('equality', function() {
        var ogFormPatternsService;

        beforeEach(inject(function(_ogFormPatternsService_) {
          ogFormPatternsService = _ogFormPatternsService_;
        }));


        it('to pattern', function() {
          innerScope.reg.password = 'test_password';
          innerScope.$digest();
          ogFormPatternsService.oneWord.test(innerScope.reg.password);
          expect(regForm.password.$error.pattern).toBeUndefined();

          innerScope.reg.password = '-/$';
          innerScope.$digest();
          ogFormPatternsService.oneWord.test(innerScope.reg.password);
          expect(regForm.password.$error.pattern).toBeTruthy();
        });
      });

      it('length', function() {
        innerScope.reg.password = 'test_';
        innerScope.$digest();
        expect(regForm.password.$error.minlength).toBeTruthy();

        innerScope.reg.password = 'test_password';
        innerScope.$digest();
        expect(regForm.password.$error.minlength).toBeUndefined();

        innerScope.reg.password = 'test_password_test_pa';
        innerScope.$digest();
        expect(regForm.password.$error.maxlength).toBeTruthy();
      });
    });
  });
});
