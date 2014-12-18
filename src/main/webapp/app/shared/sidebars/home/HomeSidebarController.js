HomeSidebarModule.controller('HomeSidebarController', ['$scope', 'ProfileService', 'GroupService', 'UserService', 'TagService', 
    function($scope, ProfileService, GroupService, UserService, TagService) {
        $scope.profile = ProfileService.get();
        $scope.groups = GroupService.query();

        $scope.suggestions = UserService.getSuggestions();

        $scope.followUser = function(suggestion, index) {
            UserService.follow({ username: suggestion.username }, { friend: !suggestion.followingUser, friendShip: true }, 
                function(response) {
                    $scope.suggestions[index].followingUser = response.friend;
            });
        },

        $scope.tags = TagService.query({ popular: true });

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) { 
                    $scope.tags[index].followed = response.followed;
            });
        }
    }
]);