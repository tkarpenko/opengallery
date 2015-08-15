describe('ogAuthService ', function() {
  
  var ogAuthService,
      $location;



  beforeEach(function() {

    module('OpenGallery');

    inject(function(_ogAuthService_, _$location_) {
      ogAuthService = _ogAuthService_;
      $location = _$location_;
    });        
  });


  it('should have be defined', function () {
    expect(ogAuthService).toBeDefined();
  });


  it('should save log info with login() method', function () {
    delete window.sessionStorage.artist;
    delete window.sessionStorage.token;

    expect(ogAuthService.isLoggedIn).toBeFalsy();

    ogAuthService.login('artist_alias','someSecretToken');

    expect(window.sessionStorage.artist).toBe('artist_alias');
    expect(window.sessionStorage.token).toBe('someSecretToken');
    expect(ogAuthService.isLoggedIn).toBeTruthy();
  });



  it('should delete log info with logout() method', function () {

    ogAuthService.login('artist_alias','someSecretToken');

    expect(window.sessionStorage.artist).toBe('artist_alias');
    expect(window.sessionStorage.token).toBe('someSecretToken');
    expect(ogAuthService.isLoggedIn).toBeTruthy();

    ogAuthService.logout();

    expect(window.sessionStorage.artist).toBeUndefined();
    expect(window.sessionStorage.token).toBeUndefined();
    expect(ogAuthService.isLoggedIn).toBeFalsy();
  });


  it('should set flag to show Registration form and redirect to /#/auth URL by calling the goToRegistration() method', function () {
    spyOn($location, 'path');
    ogAuthService.formRegistration = false;

    ogAuthService.goToRegistration();

    expect(ogAuthService.formRegistration).toBeTruthy();
    expect($location.path).toHaveBeenCalledWith('#/auth');
  });


  it('should set flag to show Login form and redirect to /#/auth URL by calling the goToLogin() method', function () {
    spyOn($location, 'path');
    ogAuthService.formRegistration = true;

    ogAuthService.goToLogin();

    expect(ogAuthService.formRegistration).toBeFalsy();
    expect($location.path).toHaveBeenCalledWith('#/auth');
  });


  it('should return login info by calling functions getArtist() and getToken()', function () {
    delete window.sessionStorage.artist;
    delete window.sessionStorage.token;

    expect(ogAuthService.getArtist()).toBe('');
    expect(ogAuthService.getToken()).toBeUndefined();

    ogAuthService.login('artist_alias','someSecretToken');

    expect(ogAuthService.getArtist()).toBe('artist_alias');
    expect(ogAuthService.getToken()).toBe('someSecretToken');
  });
});
