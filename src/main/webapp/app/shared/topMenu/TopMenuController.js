TopMenuModule.controller('TopMenuController', ['$scope', '$window', '$http', function($scope, $window, $http) {
    $scope.logout = function() {
        $http.get('/tatami/logout')
            .success(function() {
                $window.sessionStorage["userInfo"] = null;
                $scope.$state.go('tatami.login.main');
            });
    }
}]);