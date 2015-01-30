LoginModule.controller('RegisterController', ['$scope', 'RegisterService', function($scope, RegisterService) {
    $scope.user = {};

    $scope.registerUser = function() {
        var data = 'email=' + $scope.user.email;
        RegisterService.registerUser(data).$promise.then(function(success) {
            $scope.$state.go('tatami.login.main', { action: success.action });
            $scope.user.email = '';
        }, function(err) {
            console.log(err);
        })
    }
}]);