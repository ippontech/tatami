tatamiJHipsterApp
    .controller('UsersListController', ['$scope','usersList' function($scope, usersList) {
    $scope.usersList = usersList;
    $scope.followUser = function(user) {
        UserService.follow({ username: user.username }, { friend: !user.friend, friendShip: true },
            function() {
                $scope.$state.reload();
            }
        );
    };
}]);
