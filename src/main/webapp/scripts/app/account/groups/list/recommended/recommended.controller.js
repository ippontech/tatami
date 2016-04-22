tatamiJHipsterApp
    .controller('GroupsListRecommendedController', ['$scope', 'userGroups', function($scope, userGroups) {
    $scope.userGroups = userGroups;
    console.log(userGroups);
}]);
