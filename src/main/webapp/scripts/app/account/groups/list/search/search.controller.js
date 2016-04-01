tatamiJHipsterApp
    .controller('GroupsListSearchController', ['$scope', 'SearchService', function($scope, SearchService) {

    $scope.search = {};
    $scope.search = function() {
                console.log($scope.search.term);
                $scope.userGroups = SearchService.searchGroups({ query: $scope.search.term });
                console.log($scope.userGroups);
            };
}]);
