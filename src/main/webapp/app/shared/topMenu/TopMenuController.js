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

        $scope.getResults = function(searchString) {
            return SearchService.get({ term: 'all', q: searchString }).$promise.then(function(result) {
                console.log(result);
                return result.groups.concat(result.users.concat(result.tags));
            })
        };

        $scope.search = function() {
            console.log($scope.current.searchString);
            if($scope.current.searchString.length > 0) {
                SearchService.get({ term: 'all', q: $scope.current.searchString }, function(result) {
                    console.log(result);
                    // Now render the result in a dropdown box
                })
            }

        }
}]);