HomeModule.controller('ProfileHeaderController', ['$scope', 'UserService', 'user',
    function($scope, UserService, user) {
        $scope.user = user;

        $scope.followUnfollowUser = function() {
            UserService.follow(
                { username: $scope.user.username },
                { friend: !$scope.user.friend, friendShip: true },
                function(response) {
                    $scope.user.friend = response.friend;
            });
        }
    }
]);