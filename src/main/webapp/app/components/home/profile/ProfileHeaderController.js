HomeModule.controller('ProfileHeaderController', ['$scope', 'UserService', 'profile', 'user',
    function($scope, UserService, profile, user) {
        $scope.profile = profile;
        $scope.user = user;

        $scope.followUser = function() {
            UserService.follow({ username: user.username }, { friend: !user.friend, friendShip: true }, 
                function(response) {
                    $scope.user.friend = response.friend;
            });
        }
    }
]);