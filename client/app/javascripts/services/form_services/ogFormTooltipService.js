/**
  ogFormTooltipService creates Tooltips and controls their visibility
*/
angular.module('ogServices').factory('ogFormTooltipService', function() {
  return {

    // creates Tooltips and controls their visibility
    setTooltips: function(form) {
      
      var tooltips = {},
          formElemName,
          i;

      // for form that have been passed as paramter
      // create tooltips object and fill it appropriate messages
      for (i = 0; i < form.length; i++) {
        formElemName = form[i].getAttribute('name');
        tooltips[formElemName] = {};
        tooltips[formElemName].msg = this.tooltipsMsg[formElemName];
        tooltips[formElemName].show = false;
      }

      // for each form's element set tooltip's to
      for (i=0; i<form.length-1; i++) {

        // true on focus event
        form[i].onfocus = function(event) {
          tooltips[event.target.getAttribute('name')].show = true;
        }

        // false on blur event
        form[i].onblur = function(event) {
          tooltips[event.target.getAttribute('name')].show = false;
        }
      }


      return tooltips;
    },


    // Service private variable.
    // Keeps all possible tooltip messages
    tooltipsMsg: {
      fullName: "What is your first and last name?",
      alias: "Login should contain only letters and numbers (at least 3 and no more than 20 symbols.)",
      email: "Email should looks like \"email@email.email\".",
      password: "Password should contain only letters and numbers (at least 6 and no more than 20 symbols.)",
      confPassword: "Just repeat your password:)",
      submit: "All fields are required",
      addPTitle: "What is the title of new painting?",
      addPAuthor: "What is author's name ?",
      addPFile: "Allowed only next types of file: *.jpg, *.jpeg, *.png, *.gif",
      addPTool: "With which tool the picture was painted in?"
    }
  };
});