TopMenuModule.controller('TopMenuController', ['$scope', '$window', '$http', 'UserSession', function($scope, $window, $http, UserSession) {
    $scope.logout = function() {
        $http.get('/tatami/logout')
            .success(function() {
                $window.sessionStorage["authorized"] = false;
                UserSession.setLoginState(false);
                $scope.$state.go('tatami.login.main');
            });
    }
}]);