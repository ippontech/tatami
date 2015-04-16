LoginModule.controller('RecoverPasswordController', ['$scope', 'RegistrationService', function($scope, RegistrationService) {
    $scope.user = {};

    $scope.resetPassword = function() {
        var data = 'email=' + $scope.user.email;
        RegistrationService.resetPassword(data).$promise.then(function(success) {
            $scope.$state.go('tatami.login.main', { action: success.action });
            $scope.user.email = '';
        }, function(err) {
            console.log(err);
        });
    }
}]);