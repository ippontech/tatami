LoginModule.controller('GoogleLoginController', ['$scope', '$http', 'UserSession', function($scope, $http, UserSession) {

        if (UserSession.isAuthenticated()){
            $scope.$state.go('tatami.home.home.timeline');
        }
    $scope.logout = function() {
        $http.get('/tatami/logout')
            .success(function() {
                UserSession.clearSession();
                $scope.$state.go('tatami.login.main');
            });
    };
}]);