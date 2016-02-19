angular.module('tatamiJHipsterApp')
    .controller('ChangePasswordController', ['$scope', '$translate', 'PasswordService', 'ngToast', function($scope, $translate, PasswordService, ngToast) {
        $scope.password = {
            oldPassword: '',
            newPassword: '',
            newPasswordConfirmation: ''
        };

        /**
         * These booleans will determine whether popovers should be displayed
         */

        $scope.status = {
            oldEmpty: false,
            newEmpty: false,
            confirmWrong: false,
            confirmChange: false
        };

        $scope.changePassword = function() {
            if($scope.password.oldPassword === '') {
                // Display a popover on Old password field
                $scope.status.oldEmpty = true;
            }
            else if($scope.password.newPassword === '') {
                // Display a popover on the new password field
                $scope.status.newEmpty = true;
            }
            else if($scope.password.newPassword !== $scope.password.newPasswordConfirmation) {
                // Display a popover on password confirmation
                $scope.status.confirmWrong = true;
            }
            else {
                // Everything is alright, we can send the new password
                PasswordService.save($scope.password, function() {
                    // Clear the fields after we have changed the password
                    $scope.reset();
                    // Alert user that the password has been changed
                    ngToast.create($translate.instant('account.password.save'));

                }, function() {
                    ngToast.create({
                        content: $translate.instant('account.form.fail'),
                        class: 'danger'
                    });
                });
            }
        };

        $scope.reset = function() {
            $scope.password = {};
            $scope.status.oldEmpty = false;
            $scope.status.newEmpty = false;
            $scope.status.confirmWrong = false;
        };
}]);
