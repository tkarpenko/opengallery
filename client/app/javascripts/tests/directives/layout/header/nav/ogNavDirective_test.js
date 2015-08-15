describe('ogNavDirective ', function() {

  var $scope,
      $compile,
      $rootScope,
      template;



  beforeEach(function() {
    
    module('OpenGallery');
    template = '<og-nav></og-nav>';
    
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);
      $scope.$digest();
    });
  });



  it('should provide HTML template with Navigation', function() {
    expect(template[0].className).toContain('og_nav');
  });



  describe('should provide scope data to children', function() {


    it('NavHead directive', function() {
      $scope.nav.alias = 'Gallery Menu';
      $scope.$digest();
      expect(template[0].children[0].children[0].innerHTML).toEqual('Gallery Menu');

      $scope.nav.alias = 'test_user';
      $scope.$digest();
      expect(template[0].children[0].children[0].innerHTML).toEqual('test_user');    
    });


    it('NavBody directive', function() {
      $scope.nav.loggedin = false;
      $scope.$digest();
      expect(template[0].innerText).toContain('Sign In');
      expect(template[0].innerText).not.toContain('Sign Out');

      $scope.nav.loggedin = true;
      $scope.$digest();
      expect(template[0].innerText).toContain('Sign Out');
      expect(template[0].innerText).not.toContain('Sign In');    
    });
  });


  // it('should call logout() function after clicking on "Sign Out" Navigation item', function() {
  //   $scope.nav.loggedin = true;
  //   $scope.$digest();



  //   var innerScope = angular.element(template[0].children[1]).isolateScope();
  //   innerScope.$digest();
  //   console.log(innerScope);

  //   spyOn($scope.nav, 'logout');


  //   // var event = document.createEvent("MouseEvent");
  //   // event.initMouseEvent("click", true, true);
  //   // innerScope.children[3].dispatchEvent(event);

  //   $(template[0].children[1].children[3]).trigger('click');
    

  //   // console.log(angular.element(template[0].children[1].children[3]));

  //   expect($scope.nav.logout).toHaveBeenCalled();
  // });
});