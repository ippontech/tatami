describe("Preferences Tests", function() {
    var ctrl, preferencesService;
    beforeEach(module('tatamiJHipsterApp'));

    //mocking ngToast
    beforeEach(module({
        ngToast: {
            create: function() {
            }
        },
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
            'PreferencesService' : preferencesService,
            'ngToast': _ngToast_
        });
    }));

    //Tests that the test can be run, even if nonsensical
    it('sanity check', function() {
           expect(true).toBeTruthy();
    });
    it ('can save preferences', function(){
        $scope.savePrefs();
        expect(preferencesService.save).toHaveBeenCalled();
    });
});
