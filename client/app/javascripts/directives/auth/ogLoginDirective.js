/**
  ogLogin directive 
    1) provides template with Login Form
    2) Initializes form's helpers
    3) sends auth data to server and works up with server response 
*/
angular.module('ogDirectives').directive('ogLogin', 
  ['ogFormService', 'ogAuthService', 'ogLoginResource', 'bcrypt',

  function(
    ogFormService, 
    ogAuthService,      // keeps variables and methods for work up with login info
    ogLoginResource,    // resource for request to get artist's password
    bcrypt              // srvice for decryping password sended from server
  ) { 
    /**
      Directive Object
    */
    return {
      restrict: 'AE',
      templateUrl: 'views/auth/og-login.html',
      replace: true,
      scope: {
        newArtist: '='
      },
      link: function(scope, element) {
        scope.login = {};
        scope.login.wrongPass = false;
        scope.login.wrongArtist = false;
        scope.login.isChecking = false;

        // Write tooltip messages and set patterns for input fields
        scope.loginHelp = ogFormService.init(element[0]);

        // When form is valid and filling and submiting
        scope.login.submit = function() {
  
          scope.login.isChecking = true;

          // Send GET request to /api/v1/auth/login/:artist
          // to find info in DB about current artist
          ogLoginResource.getPass({alias: scope.login.alias}).$promise.then(
            function(dbArtist) {

              scope.login.isChecking = false;
              
              // If current artist is registered then checking his/her password
              if (dbArtist.registered) {
                
                // Next row hide the message that artist is not registered
                scope.login.wrongArtist = false;
                
                bcrypt.compare(scope.login.password, dbArtist.pass, function(err, samePass) {
                  
                  
                  // If he/she have typed correct password
                  // then store data (that artist is logined in) to sessionStorage 
                  // and go to Gallery
                  if (samePass) {
                    ogAuthService.login(scope.login.alias, dbArtist.token);
                    
                  // else saying that password is wrong
                  } else {
                    scope.login.wrongPass = true;
                    scope.$apply();
                  }
                });

              // Else saying that he/she is not registered
              } else {
                scope.login.wrongArtist = true;
              }
            },

            // There was some problem on server 
            function(err) {
              ogAuthService.logout();
              console.log("Saving error: " + err.status + ': ' + err.data.error);
            });
        };

        // If user on Login form now but want to go to Registration
        // we transfer him/her there
        scope.login.goReg = function() {
          ogAuthService.goToRegistration();
        };
      }
    };
  }]
);