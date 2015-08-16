describe('ogFormPatternsService ', function() {
  
  var ogFormPatternsService;



  beforeEach(function() {

    module('OpenGallery');

    inject(function(_ogFormPatternsService_) {
      ogFormPatternsService = _ogFormPatternsService_;
    });        
  });


  it('should have be defined', function () {
    expect(ogFormPatternsService).toBeDefined();
  });
});
