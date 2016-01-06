angular.module('tatami')
    .controller('LoginController', ['$scope', '$state', 'user', '$http', function($scope, $state, user, $http) {
        $scope.user = {};
        $scope.shown = false;
        $scope.failed = false;

        if(user.username) {
            $state.go('tab.dash');
        }

        $scope.login = function() {
            $http({
                method: 'POST',
                url: '/tatami/authentication',
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    j_username: $scope.user.email,
                    j_password: $scope.user.password,
                    _spring_security_remember_me: $scope.user.remember
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(success) {
                $state.go('tab.dash');
            }).error(function(err) {
                $scope.failed = true;
            });
        }
    }]);
