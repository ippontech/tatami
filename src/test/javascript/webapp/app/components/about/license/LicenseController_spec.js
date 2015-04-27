describe("License controller test", function() {

    beforeEach(module("LicenseController"));

    var $controller;

    beforeEarch(inject(function(_$controller_) {
        $controller = _$controller_;
    }));


    describe('$scope.getDate', function() {
        it('checks date to be current year', function() {
            var $scope = {};
            var controller = $controller('LicenseController', { $scope: $scope });
            expect $scope.endYear.equals(new Date().getFullYear();
        });

    });
}
