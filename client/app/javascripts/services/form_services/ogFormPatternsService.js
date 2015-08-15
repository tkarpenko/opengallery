/**
  ogFormPatternsService provides patterns for input tags in forms
*/
angular.module('ogServices').value('ogFormPatternsService', 
  {
    oneWord: /^\s*\w*\s*$/,
    email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  }
);