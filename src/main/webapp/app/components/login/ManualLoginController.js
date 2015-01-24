LoginModule.controller('ManualLoginController', ['$scope', '$rootScope', '$http', 'AuthenticationService', function($scope, $rootScope, $http, AuthenticationService) {
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
            data: { j_username: $scope.user.email, j_password: $scope.user.password },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data) {
            if(data.action === 'loginFailure') {
                $scope.$state.current.data.loginState = true;
                $scope.$state.reload();
            }
            else {
                AuthenticationService.authenticate().then(function() {
                    if(AuthenticationService.isAuthenticated()) {
                        if(angular.isDefined($rootScope.returnToState) && angular.isDefined($rootScope.returnToStateParams)) {
                            // redirect to previous state
                            $scope.$state.go($rootScope.returnToState, $rootScope.returnToParams);
                        }
                        else {
                            $scope.$state.go('tatami.home.home.timeline');
                        }
                    }
                });
                /*
                // Login is successful
                if(angular.isDefined($rootScope.returnToState) && angular.isDefined($rootScope.returnToStateParams)) {
                    // redirect the user to previous state
                    $scope.$state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                }
                else {
                    $scope.$state.go('tatami.home.home.timeline');
                }
                */
            }

        })
        .error(function(data, status, headers, config) {
            console.log('Error');
            console.log(data);
        });
    }
}]);