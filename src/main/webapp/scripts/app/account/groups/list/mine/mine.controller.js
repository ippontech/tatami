tatamiJHipsterApp
    .controller('GroupsListMineController', ['$scope', 'userGroups', function($scope, userGroups) {
        $scope.userGroups = userGroups;
    }]);
