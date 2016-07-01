'use strict';

angular.module('tatamiJHipsterApp')
.controller('TagHeaderController', ['$scope', '$state', 'TagService', 'tag',
    function($scope, $state, TagService, tag) {
        $scope.tag = tag;
        $scope.currentState = $state.current.name;

        $scope.followUnfollowTag = function() {
            TagService.follow(
                { name: $scope.tag.name, followed: !$scope.tag.followed, trendingUp: $scope.tag.trendingUp },
                function(response) {
                    $scope.tag.followed = response.followed;
                    $scope.$state.reload();
                }
            );
        };
    }
]);
