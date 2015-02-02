LoginModule.controller('ManualLoginController', ['$scope', '$rootScope', '$http', 'AuthenticationService', 'UserSession', function($scope, $rootScope, $http, AuthenticationService, UserSession) {
    $scope.user = {};
    $scope.login = function() {
        $http({
            method: 'POST',
            url: '/tatami/authentication',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { j_username: $scope.user.email, j_password: $scope.user.password, _spring_security_remember_me: $scope.user.remember },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data) {
            if(data.action === 'loginFailure') {
                $scope.$state.go('tatami.login.main', { action: data.action });
            }
            else {
                // The user has logged in, authenticate them
                UserSession.setLoginState(true);

                // Redirect the user to the state they tried to access now that they are logged in
                if(angular.isDefined($rootScope.returnToState) || angular.isDefined($rootScope.returnToStateParams)) {
                    // redirect to previous state
                    $scope.$state.go($rootScope.returnToState.name, $rootScope.returnToParams);
                }

                // If they were not trying to access a specific state, send them to the home state
                else {
                    $scope.$state.go('tatami.home.home.timeline');
                }

            }
        })
        .error(function(data, status, headers, config) {
            console.log('Error');
            console.log(data);
        });
    }
}]);