describe('ogFormTooltipService ', function() {
  
  var ogFormTooltipService,
      tooltips,
      form;



  beforeEach(function() {

    module('OpenGallery');

    inject(function(_ogFormTooltipService_) {
      ogFormTooltipService = _ogFormTooltipService_;
    });        
    
    form = '<form>                                  \
              <input name="alias" />                \
              <input name="password" />             \
              <button name="submit">Login!</button> \
            </form>';

    form = angular.element(form)[0];

    tooltips = ogFormTooltipService.setTooltips(form);
  });



  it('should have be defined', function () {
    expect(ogFormTooltipService).toBeDefined();
  });



  it('should return tooltip and text patterns for specific <form>', function() {

    expect(tooltips.alias).toEqual(
      { msg: "Login should contain only letters and numbers (at least 3 and no more than 20 symbols.)", 
        show: false
      });

    expect(tooltips.password).toEqual(
      { msg: "Password should contain only letters and numbers (at least 6 and no more than 20 symbols.)", 
        show: false 
      });

    expect(tooltips.submit).toEqual(
      { msg: "All fields are required", 
        show: false 
      });
  });




  describe("should set tooltip's property 'show' to", function() {

    beforeEach(function() {
      
      var event = document.createEvent("UIEvent");
      event.initUIEvent("focus", true, true);
      form[0].dispatchEvent(event);
    });


    it("'true' on focus event on appropriate form element", function() {
      expect(tooltips.alias.show).toBeTruthy();
    });


    it("'false' on blur event on appropriate form element", function() {

      event = document.createEvent("UIEvent");
      event.initUIEvent("blur", true, true);
      form[0].dispatchEvent(event);

      expect(tooltips.alias.show).toBeFalsy();
    });
  });
});
