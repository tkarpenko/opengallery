/**
  ogRegistrationDirective 
    1) provides template with Registration Form
    2) Initializes form's helpers
    3) sends auth data to server and works up with server response 
*/
angular.module('ogDirectives').directive('ogRegistration', 
  ['ogFormService', 'ogAuthService', 'ogRegResource', 'bcrypt',
  
  function(
    ogFormService,     
    ogAuthService,     // keeps variables and methods for work up with login info
    ogRegResource,     // resource for request to save new artist's info
    bcrypt             // service for encrypting the artist's password
  ) {
  
  /*
    Directive Object
  */
  var ogRegObj = {
    restrict: 'AE',
    templateUrl: 'views/auth/og-registration.html',
    replace: true,
    scope: {
      newArtist: '='
    },
    link: function(scope, element) {
      scope.reg = {};
      scope.reg.isSaving = false;

      // Write tooltip messages and set patterns for input fields
      scope.regHelp = ogFormService.init(element[0]);

      // When form is valid and filling and submiting
      scope.reg.submit = function() {

        scope.reg.isSaving = true;

        // Prepare data for POST request
        var newArtistData = {
          email: scope.reg.email,
          alias: scope.reg.alias,
          pass: ''
        };

        // Encrypt password whith using module dtrw.bcrypt for AngulaJS
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(scope.reg.password, salt, function(err, hash) {
            // Prepare new encrypted password for sending to DB
            newArtistData.pass = hash;

            // Send POST request to /api/v1/auth/registration
            // to save info in DB about current artist
            ogRegResource.save(newArtistData).$promise.then(
              function(sessionData) {
                scope.reg.isSaving = false;
                console.log("Data of new artist saved successfully!");

                // If artist's data have saved successfully
                // then storing data (that artist is registered and is logined in) in sessionStorage 
                // and go to Gallery
                ogAuthService.login(sessionData.alias, sessionData.token);
              },
              function(err) {
                console.log("There was an error saving. " + err.status + ': ' + err.data.error);
              });
          });
        });
      };

      // If user on Registration form now but want to go to Logining
      // we transfer him/her there
      scope.reg.goLogin = function() {
        ogAuthService.goToLogin();
      };
    },
  };

  return ogRegObj;
}]);