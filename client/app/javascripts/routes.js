/**
  Routes :)
*/
angular.module('OpenGallery')

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/auth', {
      templateUrl: 'views/auth/og-auth.html'
    })
    .when('/new', {
      templateUrl: 'views/paintings/add/index.html'
    })
    .when('/', {
      templateUrl: 'views/paintings/preview/index.html'
    })
    .when('/painting/:pId', {
      templateUrl: 'views/paintings/show/og-show.html'
    })
    .otherwise ({
      redirectTo: '/'
    });
  }]);