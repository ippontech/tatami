describe("License controller test", function() {
    beforeEach(module('ui.router'))
    beforeEach(module('AboutModule'));


    it('should set the date to todays date', inject($StateProvider, function($controller) {
        var scope= {},
            ctrl =$controller('LicenseController', {
                $scope:scope
            });
        expect(new Date().getFullYear()).equals(scope.endYear);
    }));

});
