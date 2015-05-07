describe("Password controller test", function() {
    var ctrl, passService;
    beforeEach(module('ui.router'));
    beforeEach(module('PasswordModule'));
    beforeEach(module('pascalprecht.translate'));
    
    //Mocked password service:
    beforeEach(module({
        PasswordService: {
            save: function() {
            }
        }
    }));


    //mocking ngToast
    beforeEach(module({
        ngToast: {
            create: function() { 
            }
        }
    }));


    beforeEach(inject(function($rootScope, _$controller_, _$translate_, _PasswordService_, _ngToast_) {
        $scope = $rootScope.$new();
        $translate = _$translate_;
        $controller = _$controller_;
        passService = _PasswordService_;
        spyOn(passService, 'save');
        ctrl = $controller('PasswordController', {
            $scope : $scope,
            $translate : $translate,
            'PasswordService' : passService,
            'ngToast': _ngToast_,
        });
    }));


    it('default password view', function() {
       expect($scope.status.oldEmpty).toBeFalsy();
       expect($scope.status.newEmpty).toBeFalsy();
       expect($scope.status.confirmWrong).toBeFalsy();
       expect($scope.status.confirmChange).toBeFalsy();
    });

    it('Empty old password', function() {
        $scope.changePassword();
        expect($scope.status.oldEmpty).toBeTruthy();
        expect($scope.status.newEmpty).toBeFalsy();
        expect($scope.status.confirmWrong).toBeFalsy();
        expect($scope.status.confirmChange).toBeFalsy();
    });


    it('Empty new password', function() {
        $scope.password.oldPassword = "oldy";
        $scope.changePassword();
      
        expect($scope.status.oldEmpty).toBeFalsy();
        expect($scope.status.newEmpty).toBeTruthy();
        expect($scope.status.confirmWrong).toBeFalsy();
        expect($scope.status.confirmChange).toBeFalsy();
        expect(passService.save).not.toHaveBeenCalled();
    });

    it('Password mismatch', function() {
        $scope.password.oldPassword = "oldy";
        $scope.password.newPassword = "but";
        $scope.password.newPasswordConfirmation = "goody";
        $scope.changePassword();
       
        expect($scope.status.oldEmpty).toBeFalsy();
        expect($scope.status.newEmpty).toBeFalsy();
        expect($scope.status.confirmWrong).toBeTruthy();
        expect($scope.status.confirmChange).toBeFalsy();
        expect(passService.save).not.toHaveBeenCalled();
    });

    
    it('Successful password change', function() {
        $scope.password.oldPassword = "oldy";
        $scope.password.newPassword = "newer";
        $scope.password.newPasswordConfirmation = "newer";
        $scope.changePassword();

        expect(passService.save).toHaveBeenCalled();
    });

    it('Reset', function() {
        $scope.password.oldPassword = "oldy";
        $scope.password.newPassword = "newer";
        $scope.password.newPasswordConfirmation = "test";
        $scope.changePassword();

        expect($scope.status.oldEmpty).toBeFalsy();
        expect($scope.status.newEmpty).toBeFalsy();
        expect($scope.status.confirmWrong).toBeTruthy();
        expect($scope.status.confirmChange).toBeFalsy();
   
        $scope.reset();

        expect($scope.status.oldEmpty).toBeFalsy();
        expect($scope.status.newEmpty).toBeFalsy();
        expect($scope.status.confirmWrong).toBeFalsy();
        expect($scope.status.confirmChange).toBeFalsy();
    });
});
