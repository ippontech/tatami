HomeSidebarModule.controller('HomeSidebarController', ['$scope', 'UserService', 'TagService', 'profile', 'groups', 'suggestions', 'tags',
    function($scope, UserService, TagService, profile, groups, suggestions, tags) {
        $scope.profile = profile;
        $scope.groups = groups;
        $scope.suggestions = suggestions;
        $scope.tags = tags;

        $scope.followUser = function(suggestion, index) {
            UserService.follow({ username: suggestion.username }, { friend: !suggestion.followingUser, friendShip: true }, 
                function(response) {
                    $scope.suggestions[index].followingUser = response.friend;
                    //$scope.$state.reload();
            });
        },

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) { 
                    $scope.tags[index].followed = response.followed;
                    $scope.$state.reload();
            });
        }
    }
]);