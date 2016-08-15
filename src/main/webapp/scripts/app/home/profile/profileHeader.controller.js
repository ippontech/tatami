'use strict';

angular.module('tatamiJHipsterApp')
.controller('ProfileHeaderController', ['$scope', 'UserService', 'user', 'BlockService',
    function($scope, UserService, user, BlockService) {
        $scope.user = user;

        $scope.followUnfollowUser = function() {
            UserService.follow(
                { username: $scope.user.username },
                { friend: !$scope.user.friend, friendShip: true },
                function(response) {
                    $scope.user.friend = response.friend;
                    $scope.$state.reload();
            });
        };

        $scope.updateBlockUser = function () {
            BlockService.updateBlockedUser({username: $scope.user.username}, function (response) {
                $scope.user = response;
                $scope.$state.reload();
            });
        };
    }
]);
