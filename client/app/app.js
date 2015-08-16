'use strict';

angular.module('ogDirectives', ['dtrw.bcrypt', 'ngSanitize', 'angular-md5']);

angular.module('ogResources', ['ngResource']);

angular.module('ogServices', []);


// Main module
angular.module('OpenGallery', 
  ['ngRoute',
  'templates',
  'ogDirectives',
  'ogResources',
  'ogServices'
  ])



  // http request interceptor. 
  // if artist is logged in then ogAuthRequestInterceptor 
  // adds header with session token to each request
  .config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('ogAuthRequestInterceptor');
  }])


  // Watch the route changes
  .run(['$rootScope', '$location', 'ogAuthService',
    function($rootScope, $location, ogAuthService) {

      // If route is changed
      $rootScope.$on('$routeChangeStart', function(event, next, current) {

        // If route is changing without browser refresh
        if (next.$$route) {

          // Artist can get to Add New Painting page only when he/she is logged in
          if (next.$$route.originalPath === '/new' && !ogAuthService.getToken()) {

            // If it is not so then redirect to Login page
            event.preventDefault();
            $location.path('/auth');
          }

          // Artist can get to Login page only when he/she is not logged in
          if (next.$$route.originalPath === '/auth' && ogAuthService.getToken()) {

            // If he/she is logged in now then redirect to Gallery page
            $location.path('/');
          }  

          // After route changes or browser refreshes fire the event
          // for ogFilterStateService to get Filter state from sessionStorage
          $rootScope.$broadcast('restoreFilterState');
        }

      });

      // If time when session token is valid (this time calculates on server)
      // is finished but artist did not log out then log out him/her
      if (!ogAuthService.getToken()) {
        ogAuthService.logout();
      }
    }
  ]);