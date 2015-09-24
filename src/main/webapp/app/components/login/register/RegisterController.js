LoginModule.controller('RegisterController', ['$scope', 'RegistrationService', function($scope, RegistrationService) {
    $scope.user = {};

    $scope.registerUser = function() {
        var data = 'email=' + $scope.user.email;
        RegistrationService.registerUser(data).$promise.then(function(success) {
            $scope.$state.go('tatami.login.main', { action: success.action });
            $scope.user.email = '';
        }, function(err) {
            console.log(err);
        });
    };
}]);