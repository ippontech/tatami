tatamiJHipsterApp
    .controller('UsersFollowingController', ['$scope', 'usersList', function($scope, usersList) {
        $scope.usersList = usersList;
    }]);
