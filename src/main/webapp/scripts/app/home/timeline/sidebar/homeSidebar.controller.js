'use strict';

angular.module('tatamiJHipsterApp')
    .controller('HomeSidebarController', ['$scope', '$state', 'UserService', 'TagService', 'groups', 'suggestions', 'tags',
    function($scope, $state, UserService, TagService, groups, suggestions, tags) {
        $scope.groups = groups;
        $scope.suggestions = suggestions;
        $scope.tags = tags;

        $scope.followUser = function(suggestion, index) {
            UserService.follow({ email: suggestion.email }, { friend: !suggestion.followingUser, friendShip: true },
                function() {
                    $scope.suggestions[index].followingUser = !$scope.suggestions[index].followingUser;
            });
        };

        $scope.followTag = function(tag, index) {
            TagService.follow({ name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp },
                function(response) {
                    $scope.tags[index].followed = response.followed;
                    $scope.$state.reload();
            });
        };
    }
]);
