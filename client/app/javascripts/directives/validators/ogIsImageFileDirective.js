/**
  ogIsUniqueDirective used with input[type="file"] tag
  <input type="file" og-is-image-file />

  to figure out does selected file have admissible type and size
*/
angular.module('ogDirectives').directive('ogIsImageFile', function() {
  return {
    restrict: 'A',


    // will be used methods from parent directives ngModel and ogAddPainting
    require: ['^ngModel', '^ogAddPainting'],


    /* Link update
      1) value of [form].[input].$error.imageFile
      2) value of ng-model when artist select new file
    */
    link: function(scope, elem, attrs, ctrls) {
      var ngModel       = ctrls[0],
          ogAddPainting = ctrls[1];

      var fileMaxSize    = 2 * (1024 * 1024),    // max size 2 * 1Mb = 2Mb
          fileValidTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];



      // updating the [form].[input].$error.imageFile 
      ngModel.$validators.imageFile = function(file) {
        
        // If artist choose file 
        if (file) {


          // and if this file is valid
          if ( ( file.size < fileMaxSize ) && ( ~fileValidTypes.indexOf(file.type) ) ) {
            
            // then update button's text (it would be now file.name)
            ogAddPainting.setPaintingFileName(file.name);

            // and set [form].[input].$error.imageFile = undefined
            return true;


          // if this file is not valid
          } else {

            // then set button's text to initial state
            ogAddPainting.setPaintingFileName('Select File');

            // and set [form].[input].$error.imageFile = true
            return false;
          }


        // If no file was choosen
        } else {

          // then set button's text to initial state
          ogAddPainting.setPaintingFileName('Select File');
        }
        return true;
      };



      // Update value of ng-model when artist select new file
      elem[0].addEventListener('change', function (event) {
        ngModel.$setViewValue(event.target.files[0]);
        scope.$apply();
      });
    }
  }
});