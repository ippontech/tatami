TopMenuModule.controller('TopMenuController', [
    '$scope',
    '$window',
    '$http',
    'UserSession',
    'SearchService',
    function($scope, $window, $http, UserSession, SearchService) {
        $scope.current = {};
        $scope.current.searchString = '';

        $scope.logout = function() {
            $http.get('/tatami/logout')
                .success(function() {
                    UserSession.clearSession();
                    $scope.$state.go('tatami.login.main');
                });
        };

        $scope.search = function() {
            console.log($scope.current.searchString);
            SearchService.get({ term: 'all', q: $scope.current.searchString }, function(result) {
                console.log(result);
                // Now render the result in a dropdown box
            })
        }
}]);