/**
  ogFormService initialize text patterns and tooltips
  for specific Form
*/
angular.module('ogServices').factory('ogFormService', 
  ['ogFormTooltipService', 'ogFormPatternsService', 
  
  function(
    ogFormTooltipService,    // creates Tooltips and controls their visibility
    ogFormPatternsService    // provides patterns for input tags in forms
  ) {
    return {

      // initialize text patterns and tooltips for specific Form
      init: function (form) {

        var help = {};
        
        help.pattern = {
          oneWord: ogFormPatternsService.oneWord,
          email: ogFormPatternsService.email
        };
        
        help.tooltip = ogFormTooltipService.setTooltips(form);

        return help;
      }
    }
   }]);