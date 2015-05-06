describe("Preferences Tests", function() {
    var ctrl, preferencesService;
    beforeEach(module('ui.router'));
    beforeEach(module('PreferencesModule'));
    beforeEach(module('pascalprecht.translate'));

    //mocking ngToast
    beforeEach(module({
        ngToast: {
            create: function() { 
            }
        }
    }));
    beforeEach(module({
        PreferencesService : {
            save: function(){

            }
        }
    }));


    beforeEach(inject(function($rootScope, _$controller_, _$translate_, _PreferencesService_, _ngToast_) {
        $scope = $rootScope.$new();
        $translate = _$translate_;
        $controller = _$controller_;
        preferencesService = _PreferencesService_;
        var prefs = {
            test : "accepted"
        };

        spyOn(preferencesService, 'save');
        ctrl = $controller('PreferencesController', {
            $scope : $scope,
            $translate : $translate,
            'prefs' : prefs,
            'PreferencesService' : preferencesService,
            'ngToast': _ngToast_
        });
    }));

    //Tests that the test can be run, even if nonsensical
    it('sanity check', function() {
           expect(true).toBeTruthy();
    });
    //this proves that the controller is loading properly, and tests below are valid.
    it ('test working properly', function(){
        console.log("Scope prefs: " + $scope.prefs.test);
        expect($scope.prefs!==null);
        expect($scope.prefs.test==="accepted");

    });
    it ('can save preferences', function(){
        $scope.savePrefs();
        expect(preferencesService.save).toHaveBeenCalled();
    });
});
