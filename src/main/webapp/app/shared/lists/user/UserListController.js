HomeModule.controller('UserListController', ['$scope', 'UserService', 'users',
    function($scope, UserService, users) {
        $scope.users = users;

        $scope.followUser = function(user, index) {
            UserService.follow({ username: user.username }, { friend: !user.friend, friendShip: true }, 
                function(response) {
                    $scope.users[index].friend = response.friend;
                    $scope.$state.reload();
            });
        }
    }
]);