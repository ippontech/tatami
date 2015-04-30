describe("About module routing test", function() {

    var rootScope, state, injector;
    beforeEach(module("ui.router"));
    beforeEach(module("AboutModule"));
// beforeEach(module('aboutBody'));
    
    beforeEach(inject(function ($rootScope, $state, $injector) {
        rootScope = $rootScope;
        state = $state;
        injector = $injector;
    }));



    it('test routing to license', function() {
        //state.transitionTo('tatami.about.license');
        console.info(state.get());
        rootScope.$apply();

    });
});
