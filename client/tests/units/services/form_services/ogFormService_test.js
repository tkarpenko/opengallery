describe('ogFormService ', function() {
  
  var ogFormPatternsService,
      ogFormService,
      ogFormTooltipService,
      template;



  beforeEach(function() {

    module('OpenGallery');

    inject(function(_ogFormPatternsService_, _ogFormTooltipService_, _ogFormService_) {
      ogFormPatternsService = _ogFormPatternsService_;
      ogFormService = _ogFormService_;
      ogFormTooltipService = _ogFormTooltipService_;
    });        
  });


  it('should have be defined', function () {
    expect(ogFormService).toBeDefined();
  });

  it('should return tooltip and text patterns for specific <form>', function() {

    spyOn(ogFormTooltipService, 'setTooltips').and.returnValue(
      {
        alias:    {msg: "Login should contain only letters and numbers", show: false},
        password: {msg: "Password should contain only letters and numbers", show: false},
        submit:   {msg: "All fields are required", show: false}
      }
    );

    template = '<form>                                  \
                  <input name="alias" />                \
                  <input name="password" />             \
                  <button name="submit">Login!</button> \
                </form>';

    var formHelp = ogFormService.init(angular.element(template)[0]);

    expect(formHelp.pattern).toBeDefined();

    expect(formHelp.tooltip.alias).toBeDefined();
    expect(formHelp.tooltip.password).toBeDefined();
    expect(formHelp.tooltip.submit).toBeDefined();

    expect(ogFormTooltipService.setTooltips).toHaveBeenCalled();
  });
});
