LoginModule.controller('GoogleLoginController', ['$scope', '$http', function($scope, $http) {
    $scope.login = function() {
        $http({
            method: 'POST',
            url: '/tatami/j_spring_openid_security_check',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log(data);
            })
    }
}]);