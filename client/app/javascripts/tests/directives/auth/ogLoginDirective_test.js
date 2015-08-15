describe('ogLoginDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope, 
      template;



  beforeEach(function() {
    module('OpenGallery');
    template = "<og-login></og-login>";
    
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




    it('Login Form.', function() {
      expect(template[0].getAttribute('name')).toBe('loginForm');
    });


    it('Tooltips and Input Patterns for Login form', function() {
      $scope.loginHelp = ogFormService.init(template[0]);
      $scope.$digest();
      var tooltips = template.find('.og_tooltip');

      // Tooltips info
      expect(tooltips[0].innerHTML).toBe($scope.loginHelp.tooltip.alias.msg);
      expect(tooltips[1].innerHTML).toBe($scope.loginHelp.tooltip.password.msg);
      expect(tooltips[2].innerHTML).toBe($scope.loginHelp.tooltip.submit.msg);

      // Input patterns for next validation
      expect(template.find('input')[2].getAttribute('ng-pattern')).toBe($scope.loginHelp.pattern.oneWord+'');
      expect(template.find('input')[3].getAttribute('ng-pattern')).toBe($scope.loginHelp.pattern.oneWord+'');
    });
  });




  describe('should to send', function() {
    var $httpBackend,
        ogApiUrl,
        ogLoginResource,
        promise;


    beforeEach(function() {
      inject(function(_ogLoginResource_, _ogApiUrl_, _$httpBackend_) {
        
        $httpBackend = _$httpBackend_;
        ogLoginResource = _ogLoginResource_;
        ogApiUrl = _ogApiUrl_;
      });

      $httpBackend.expectGET(ogApiUrl + '/auth/login/test_user_alias'
      ).respond(
        200, 
        {
          registered: true,
          pass: 'crypted_pass', 
          token: 'token'
        }
      );

      promise = ogLoginResource.getPass({ alias: 'test_user_alias' });
    });



    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });



    it('login data to backend', function() {
      promise.$promise.then(function(data) {
        expect(data.registered).toBeTruthy();
        expect(data.pass).toBe('crypted_pass');
        expect(data.token).toBe('token');
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



    it('goReg() function after clicking on link "Registration".', function() {
      spyOn(innerScope.login, 'goReg');

      var event = document.createEvent("MouseEvent");
      event.initMouseEvent("click", true, true);
      template[0].children[4].children[0].dispatchEvent(event);
    
      expect(innerScope.login.goReg).toHaveBeenCalled();
    });


    it('submit() function after submiting.', function() {
      spyOn(innerScope.login, 'submit');

      $(template).trigger('submit');
      expect(innerScope.login.submit).toHaveBeenCalled();
    });
  });



  describe('should', function() {
    var innerScope,
        loginForm;



    beforeEach(function() {
      innerScope = template.isolateScope();
      innerScope.$digest();

      loginForm = innerScope.loginForm;
    });



    describe('check validity', function() {


      describe('of alias', function() {
      
        it('length', function() {
          innerScope.login.alias = 'te';
          innerScope.$digest();
          expect(loginForm.alias.$error.minlength).toBeTruthy();

          innerScope.login.alias = 'test_user';
          innerScope.$digest();
          expect(loginForm.alias.$error.maxlength).toBeUndefined();

          innerScope.login.alias = 'test_user_test_user_l';
          innerScope.$digest();
          expect(loginForm.alias.$error.maxlength).toBeTruthy();
        });



        describe('equality', function() {
          var ogFormPatternsService;



          beforeEach(inject(function(_ogFormPatternsService_) {
            ogFormPatternsService = _ogFormPatternsService_;
          }));



          it('to pattern', function() {
            innerScope.login.alias = 'te';
            innerScope.$digest();
            ogFormPatternsService.oneWord.test(innerScope.login.alias);
            expect(loginForm.alias.$error.pattern).toBeUndefined();
            
            innerScope.login.alias = 'te/';
            innerScope.$digest();
            ogFormPatternsService.oneWord.test(innerScope.login.alias);
            expect(loginForm.alias.$error.pattern).toBeTruthy();
          });
        });
      });
      

      describe('of password', function() {


        describe('equality', function() {
          var ogFormPatternsService;



          beforeEach(inject(function(_ogFormPatternsService_) {
            ogFormPatternsService = _ogFormPatternsService_;
          }));



          it('to pattern', function() {
            innerScope.login.password = 'test_password';
            innerScope.$digest();
            ogFormPatternsService.oneWord.test(innerScope.login.password);
            expect(loginForm.password.$error.pattern).toBeUndefined();

            innerScope.login.password = '-/$';
            innerScope.$digest();
            ogFormPatternsService.oneWord.test(innerScope.login.password);
            expect(loginForm.password.$error.pattern).toBeTruthy();
          });
        });



        it('length', function() {
          innerScope.login.password = 'test_';
          innerScope.$digest();
          expect(loginForm.password.$error.minlength).toBeTruthy();

          innerScope.login.password = 'test_password';
          innerScope.$digest();
          expect(loginForm.password.$error.minlength).toBeUndefined();

          innerScope.login.password = 'test_password_test_pa';
          innerScope.$digest();
          expect(loginForm.password.$error.maxlength).toBeTruthy();
        });
      });
    });   
  });
});
