tatamiJHipsterApp
    .controller('UsersSearchController', ['$scope', 'SearchService', function($scope, SearchService) {
    $scope.search = {};
    $scope.search = function() {
        if($scope.search.term.length > 0) {
            $scope.usersList = SearchService.query({ term: 'users', q: $scope.search.term });
            console.log($scope.usersList);
        }
        else{
            $scope.usersList = null;
        };
    };
}]);
