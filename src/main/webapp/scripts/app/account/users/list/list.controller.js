tatamiJHipsterApp
    .controller('UsersListController', ['$scope','UserService',function($scope, UserService) {


    $scope.followUser = function(user) {

        $scope.user = user;

        $scope.user.friend = UserService.follow(
            { username: $scope.user.username },
            { friend: !$scope.user.friend, friendShip: $scope.user.friend }
        ).friend;
    };

}]);
