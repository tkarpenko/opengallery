describe('ogFilterStateService ', function() {
  
  var ogFormTooltipService,
      $rootScope,
      tools,
      form;



  beforeEach(function() {

    module('OpenGallery');

    inject(function(_ogFilterStateService_, _$rootScope_) {
      ogFilterStateService = _ogFilterStateService_;
      $rootScope = _$rootScope_;
    });        

    tools = [
      {value: 'oils', name: 'Oils', ptId: 1},
      {value: 'gouache', name: 'Gouache', ptId: 2},
      {value: 'pencils', name: 'Pencils', ptId: 3},
      {value: 'pastel', name: 'Pastel', ptId: 4},
      {value: 'camera', name: 'Camera', ptId: 5}
    ];

    delete window.sessionStorage.filterToolsStates;

    ogFilterStateService.initTools(tools);
  });



  it('should have be defined', function () {
    expect(ogFilterStateService).toBeDefined();
  });



  it('should initialize state of Filter with Items that corresponds to specific Painting Tool', function() {

    expect(ogFilterStateService.isToolActive('oils')).toBeFalsy();
    expect(ogFilterStateService.isToolActive('gouache')).toBeFalsy();
    expect(ogFilterStateService.isToolActive('pencils')).toBeFalsy();
    expect(ogFilterStateService.isToolActive('pastel')).toBeFalsy();
    expect(ogFilterStateService.isToolActive('camera')).toBeFalsy();

  });



  it("should toggle specific Filter's Item state and fire 'filterUpdated' event", function() {
    spyOn($rootScope, '$broadcast');
    expect(ogFilterStateService.isToolActive('oils')).toBeFalsy();

    ogFilterStateService.toggleTool('oils');

    expect(ogFilterStateService.isToolActive('oils')).toBeTruthy();
    expect($rootScope.$broadcast).toHaveBeenCalledWith('filterUpdated', true);
  });


  it("should save current Filter state as string", function() {
    
    ogFilterStateService.toggleTool('oils');
    ogFilterStateService.saveState();

    var statesSting = JSON.stringify(
      {
        oils: true,
        gouache: false,
        pencils: false,
        pastel: false,
        camera: false
      });

    expect(window.sessionStorage.filterToolsStates).toContain(statesSting);
  });
});
