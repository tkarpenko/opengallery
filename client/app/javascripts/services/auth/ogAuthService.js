/**
  ogAuthService keeps variables and methods for work up with login info
*/
angular.module('ogServices').factory('ogAuthService', 
  ['$location', '$rootScope', 

  function(
    $location,
    $rootScope
  ) {
    return {

      // flag for ogAuth directive for control of what kind of the form 
      // to show on authentication page (/#/auth) :
      // false - Login Form will be shown
      // true  - Registation Form will be shown
      formRegistration: false,

      // flag shows is artist logged in or isn't 
      isLoggedIn: (window.sessionStorage.token !== undefined),

      // set login information after success logining
      // and redirect to Gallery page
      login: function(artist, newToken) {
        this.isLoggedIn = true;
        window.sessionStorage.artist = artist;
        window.sessionStorage.token = newToken;
    
        $rootScope.$evalAsync(function() {
          $location.path('/');
        });
      },

      // Return the artist's alias if artist is logged in
      getArtist: function() {
        return window.sessionStorage.artist || '';
      },

      // Return the session token if artist is logged in
      getToken: function() {
        return window.sessionStorage.token;
      },

      // Redirect to Registration Form when artist clicked on
      // appropriate link on Login Form page
      goToRegistration: function() {
        this.formRegistration = true;
        $location.path("#/auth");
      },

      // Redirect to Login Form when artist clicked on
      // appropriate link on Login Registration page
      goToLogin: function() {
        this.formRegistration = false;
        $location.path("#/auth");
      },

      // Delete all login info
      // and redirect to Gallery page
      logout: function() {
        this.isLoggedIn = false;
        delete window.sessionStorage.token;
        delete window.sessionStorage.artist;
        $location.path('/');
      }
    };
  }]);


angular.module('OpenGallery')
  .run(function() {
    // Imitate sessionStorage if it not exist
    if (!window.sessionStorage) {
      window.sessionStorage = {
        getItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
          return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        },
        key: function (nKeyId) {
          return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
        },
        setItem: function (sKey, sValue) {
          if(!sKey) { return; }
          document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
          this.length = document.cookie.match(/\=/g).length;
        },
        length: 0,
        removeItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return; }
          document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          this.length--;
        },
        hasOwnProperty: function (sKey) {
          return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
      };
      window.sessionStorage.length = (document.cookie.match(/\=/g) || window.sessionStorage).length;
    }
  });