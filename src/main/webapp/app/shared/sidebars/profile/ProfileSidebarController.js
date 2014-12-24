ProfileSidebarModule.controller('ProfileSidebarController', ['$scope', 'TagService', 'profile', 'tags',
    function($scope, TagService, profile, tags) {
        $scope.profile = profile;

        $scope.tags = tags;

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) {
                    $scope.tags[index].followed = response.followed;
            });
        }
    }
]);