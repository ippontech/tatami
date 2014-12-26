HomeModule.controller('UserListController', ['$scope', 'UserService', 'profile', 'user', 'users',
    function($scope, UserService, profile, user, users) {
        $scope.profile = profile;
        $scope.user = user;
        $scope.users = users;

        $scope.followUser = function(user, index) {
            UserService.follow({ username: user.username }, { friend: !user.friend, friendShip: true }, 
                function(response) {
                    $scope.users[index].friend = response.friend;
            });
        }
    }
]);