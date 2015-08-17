describe('ogFilterItemsDirective ', function() {
  var $scope, 
      $compile, 
      $rootScope, 
      template;



  beforeEach(function() {


    var tool = JSON.stringify({value: 'oils', name: 'Oils', ptId: 1});


    module('OpenGallery');
    template = "<og-filter-items tool=" + tool + "></og-filter-items>";
    

    
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      template = $compile(template)($scope);
      $scope.$digest();
    });
  });



  it("should provide template with filter's item button", function() {
    expect(template[0].querySelectorAll('button').length).toBe(1);
  });



  describe("should react on click on Filter's item button", function() {
    var ogFilterStateService;

    beforeEach(inject(function(_ogFilterStateService_) {
      ogFilterStateService = _ogFilterStateService_;
    }));



    it('and call function to change state of Filter', function() {
      spyOn(ogFilterStateService, 'toggleTool');

      var event = document.createEvent("MouseEvent");
      event.initMouseEvent("click", true, true);
      template[0].children[0].dispatchEvent(event);

      expect(ogFilterStateService.toggleTool).toHaveBeenCalledWith('oils');
    });
  });
});