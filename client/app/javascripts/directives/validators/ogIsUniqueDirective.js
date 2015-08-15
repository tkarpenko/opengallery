/**
  ogIsUniqueDirective used with input[type="text"] tag
  <input type="text" value="current_alias" og-is-unique />

  to figure out is value in DB on server or isn't
*/
angular.module('ogDirectives').directive('ogIsUnique', 
  ['ogRegResource', '$q', 

  function(
    ogRegResource,  // resource for request for check presence of inputed alias in DB
    $q
  ) {
  return {
    restrict: 'A',

    // will be used methods from parent directive ngModel
    require: 'ngModel',
    link: function(scope, ele, attrs, ngModel) {
      
      // When artist make some changes in Alias field 
      // then $asyncValidators goes to check does such user exist
      ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
        return $q(function (resolve, reject) {
          
          // With any changes in Alias field 
          // GET request are sending to /api/v1/auth/registration/:alias
          ogRegResource.isUnique({alias: ele[0].value}).$promise.then(
            function (alias) {
              if (alias.unique) {
                
                // If there is NO such alias in DB - new alias is valid
                resolve();
              } else {
                
                // If there is such alias in DB - new alias is INvalid
                reject();
              }
            }, 
            function (err) {
              
              // If some problems on server - new alias is INvalid
              console.log('Some problems on server. ' + err.status + ': ' + err.data.error);
              reject();
            });
        });
      };
    }
  }
}]);