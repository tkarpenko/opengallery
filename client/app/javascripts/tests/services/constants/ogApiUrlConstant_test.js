describe('ogApiUrl ', function() {
  
  var ogApiUrl;


  beforeEach(function() {

    module('OpenGallery');

    inject(function(_ogApiUrl_) {
      ogApiUrl = _ogApiUrl_;
    });        
  });


  it('should have be defined', function () {
    expect(ogApiUrl).toBeDefined();
  });
});
