tatamiJHipsterApp
    .controller('UsersSearchController', ['$scope', 'SearchService', function($scope, SearchService) {

    $scope.search = {};
    $scope.search = function() {
        console.log($scope.search.term);
        if($scope.search.term.length > 0) {
            $scope.usersList = SearchService.query({ term: 'users', q: $scope.search.term });
        }
        else{
            $scope.usersList = null;
        };
        console.log($scope.usersList);
    };
}]);
