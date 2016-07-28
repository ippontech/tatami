'use strict';

angular.module('tatamiJHipsterApp')
.controller('ProfileHeaderController', ['$scope', 'UserService', 'user', 'BlockService',
    function($scope, UserService, user, BlockService) {
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

        $scope.updateBlockUser = function () {
            BlockService.updateBlockedUser({email: $scope.user.email}, function (response) {
                $scope.user = response;
                $scope.$state.reload();

            });
        };
    }
]);
