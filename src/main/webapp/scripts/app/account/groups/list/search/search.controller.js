tatamiJHipsterApp
    .controller('GroupsListSearchController', ['$scope', 'SearchService', function($scope, SearchService) {

    $scope.search = {};
    $scope.search = function() {
                console.log($scope.search.term);
                $scope.userGroups = SearchService.query({ term: 'groups', q: $scope.search.term });
                console.log($scope.userGroups);
            };
}]);
