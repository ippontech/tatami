LoginModule.controller('RecoverPasswordController', ['$scope', 'RecoverPasswordService', function($scope, RecoverPasswordService) {
    $scope.user = {};

    $scope.resetPassword = function() {
        var data = 'email=' + $scope.user.email;
        RecoverPasswordService.resetPassword(data).$promise.then(function(success) {
            $scope.$state.go('tatami.login.main', { action: success.action });
            $scope.user.email = '';
        }, function(err) {
            console.log(err);
        });
    }
}]);