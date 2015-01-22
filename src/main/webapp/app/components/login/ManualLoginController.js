LoginModule.controller('ManualLoginController', ['$scope', '$rootScope', '$http', 'UserSession', function($scope, $rootScope, $http, UserSession) {
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
                    console.log('To login page');
                    $scope.$state.current.data.loginState = true;
                    $scope.$state.reload();
                }
                else {
                    UserSession.setAuthStatus(true, $scope.user.email);
                    // Login is successful
                    if(angular.isDefined($rootScope.returnToState) && angular.isDefined($rootScope.returnToStateParams)) {
                        // redirect the user to previous state
                        $scope.$state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                    }
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