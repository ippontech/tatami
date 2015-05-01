describe("License controller test", function() {
    beforeEach(module('ui.router'));
    beforeEach(module('AboutModule'));

    beforeEach(inject(function(_$controller_) {
       $controller = _$controller_; 
    }));

    it('Checks that LicenseController injects current year in the copyright', function() {
        var $scope = {};
        var controller = $controller('LicenseController', {$scope: $scope});
        expect($scope.endYear).toBe( new Date().getFullYear());
    });

});
