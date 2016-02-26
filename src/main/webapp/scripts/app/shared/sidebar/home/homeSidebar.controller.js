angular.module('tatamiJHipsterApp')
    .controller('HomeSidebarController', ['$scope', 'UserService', 'TagService', 'profile', 'groups', 'suggestions', 'tags',
    function($scope, UserService, TagService, profile, groups, suggestions, tags) {
        console.log("in HomeSidebarController");
        $scope.profile = profile;
        $scope.groups = groups;
        $scope.suggestions = suggestions;
        $scope.tags = tags;

        console.log(profile);
        console.log(groups);
        console.log(suggestions);
        console.log(tags);

        $scope.followUser = function(suggestion, index) {
            UserService.follow({ username: suggestion.username }, { friend: !suggestion.followingUser, friendShip: true },
                function(response) {
                    $scope.suggestions[index].followingUser = response.friend;
            });
        };

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp },
                function(response) {
                    $scope.tags[index].followed = response.followed;
                    $scope.$state.reload();
            });
        };

        console.log("end homeSidebar.controller.js");
    }
]);
