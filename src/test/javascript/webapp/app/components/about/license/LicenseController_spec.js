describe("License controller test", function() {

    var scope;
    var ctrl;
    var $stateProvider;


    beforeEach(module('AboutModule') {
    };

    beforeEach(inject(function($rootScope, $controller, $stateProvider) ) {
        scope = $rootScope.$new();
        ctrl = $controller('LicenseController', {$scope, $scope});
        $stateProvidr = stateMock;
    }));

    it('Sanity check', function() {
        expect(true).toBeTruthy();
    });

});
