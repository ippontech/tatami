tatamiJHipsterApp
    .controller('UsersListController', ['$scope','UserService', function($scope, UserService) {
    $scope.followUser = function(user) {

        $scope.user = user;
        console.log(user);
        $scope.user.friend = UserService.follow(
            { username: user.username },
            { friend: !$scope.user.friend, friendShip: $scope.user.friend }
        ).friend;

    };

}]);
