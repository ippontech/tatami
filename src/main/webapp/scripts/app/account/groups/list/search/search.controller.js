tatamiJHipsterApp
    .controller('GroupsListSearchController', ['$scope', 'SearchService', function($scope, SearchService) {
        $scope.search = {};
        $scope.search = function() {
            $scope.userGroups = SearchService.query({ term: 'groups', q: $scope.search.term });
        };
}]);
