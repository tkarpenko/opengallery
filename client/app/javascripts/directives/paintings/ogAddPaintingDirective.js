/**
  ogAddPaintingDirective 
  1) Provides data to view
  2) Initializes form's helpers
  3) Gets data about painting tools (oils, pencils, ...)
  4) Manages loader's activity
     (it's visible after data about new painting has been submitted)
  5) Sends data about new painting to database
*/
angular.module('ogDirectives').directive('ogAddPainting', 
  ['ogFormService', 'ogAuthService', 'ogAddPaintingResource', 'ogPaintingToolsResource', '$sanitize', '$location', 'md5', '$rootScope', '$cacheFactory',
  
  function(
    ogFormService, 
    ogAuthService,             // keeps variables and methods for work up with login info
    ogAddPaintingResource,     // resource for request for saving data about new Painting
    ogPaintingToolsResource,   // resource for request for getting list of Painting Tools 
    $sanitize,                 // service for deleting HTML and JavaScripts syntaxes from Form's inputs
    $location, 
    md5,                       // use for creating unique file name
    $rootScope,
    $cacheFactory              // service use after new Painting was saved on backend and 
                               // before browser will redirect to Gallery page
  ) {
  return {
    restrict: 'AE',
    templateUrl: 'views/paintings/add/og-add-painting.html',
    replace: true,
    

    /**
       Controller shares function setPaintingFileName() 
       with child directive og-is-image-file (*). 
       
       (*) Directive og-is-image-file validates selected file 
       (file has to have valid type and size) 
    */
    controller: ['$scope', function($scope) {

      // Update image file on button in the view.
      this.setPaintingFileName = function(fileName) {
        $scope.addP.fileName = fileName;
      }
      return this;
    }],


    /**
      Link manage all data transfering:
      1) Provides data to view
      2) Initializes form's helpers
      3) Gets data about painting tools (oils, pencils, ...)
      4) Manages loader's activity
         (it's visible after data about new painting has been submitted)
      5) Sends data about new painting to database
    */
    link: function(scope, element) {
      

      // View's data model.
      scope.addP = {};


      // Flag for loader. From the very beginning it is not active.
      scope.addP.isSaving = false;


      // Initializing form's helpers:
      // write tooltip messages and set patterns for input fields.
      scope.addPHelp = ogFormService.init(element[0]);


      // Get available painting tools from DB
      // using resource ogPaintingToolsResource.
      var paintingTools = ogPaintingToolsResource.get(function(response) {
        response.$promise.then(

          // If request was successful:
          function() {
            // set all tools as options in <select> tag in the view
  
            scope.addP.paintingTools = paintingTools;

            // set selected tool
            scope.addP.tool          = paintingTools[0];
          },

          // If request was not successful
          function(err) {
            console.log('Some problems on server: ' + err.status + ': ' + err.data.error);
          }
        );
      });


      // When form is valid and submitted.
      scope.addP.submit = function() {

        // Update flag for loader. Make it active.
        scope.addP.isSaving = true;

        // Save extension of image file 
        // (it will be used for creating new unique file's name to save on server).
        var fileExtension = (scope.addP.file.name).slice(-4);

        // Request to ogAddPaintingResource resource 
        // for finding the last used ID for paintings in DB.
        // Then this ID will be incremented 
        // and info about new painting will be saved with this new unique ID.
        var painting = ogAddPaintingResource.getPrevPaintingID(function(response) {
          response.$promise.then(
            
            // If request was successful:
            function() {

              // Prepare form data for sending to server...

              // ** $sanitize service is using for security: 
              //    it deletes HTML and JavaScripts syntaxes.
              painting.pId++;
              painting.title       = $sanitize(scope.addP.title);
              painting.author      = $sanitize(scope.addP.author);
              painting.tool        = scope.addP.tool.value;
              painting.description = $sanitize(scope.addP.desc);
              painting.addedBy     = ogAuthService.getArtist();

              // Create unique file name with using md5 encryption
              painting.fileName    = md5.createHash('opengallerypainting'+painting.pId)+fileExtension;
              painting.file        = scope.addP.file;
              

              // Request for saving data about new painting
              painting.$save(function(response) {
                response.$promise.then(

                  // If request was successful:
                  function() {

                    // After cache clearing new painting will be display
                    // on Gallery page with no need to refresh the browser
                    $cacheFactory.get('/paintings/preview').removeAll();

                    // Timeout shows loader for 2 sec
                    // (without timeout function new painting still not display 
                    // on gallery page if it is not refresh
                    // TODO: figure out WHY!)
                    setTimeout(function() {
                      $rootScope.$evalAsync(function() {
                        // TODO Notification service
                        $location.path('#/');
                      });
                    }, 5000);
                  },

                  // If request was not successful
                  function(err) {
                    // TODO Notification service

                    // Update flag for loader. Disable it.
                    scope.addP.isSaving = false;
                    console.log('Error on server: ' + err.status + ': ' + err.data.error);
                  });
              });
            },

            // If request was not successful
            function(err) {
              console.log('Error on server: ' + err.status + ': ' + err.data.error);
            }
          );
        });
      };
    }
  };
}]);