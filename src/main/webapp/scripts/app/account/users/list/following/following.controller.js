tatamiJHipsterApp
    .controller('UsersFollowingController', ['$scope', 'usersList', function($scope, usersList) {
        $scope.usersList = usersList;
        console.log($scope.usersList);
    }]);
