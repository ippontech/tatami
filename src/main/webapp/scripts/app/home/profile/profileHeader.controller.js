'use strict';

angular.module('tatamiJHipsterApp')
.controller('ProfileHeaderController', ['$scope', 'UserService', 'user',
    function($scope, UserService, user) {
        $scope.user = user;

        $scope.followUnfollowUser = function() {
            UserService.follow(
                { email: $scope.user.email },
                { friend: !$scope.user.friend, friendShip: true },
                function(response) {
                    $scope.user.friend = response.friend;
                    $scope.$state.reload();
            });
        };
    }
]);
