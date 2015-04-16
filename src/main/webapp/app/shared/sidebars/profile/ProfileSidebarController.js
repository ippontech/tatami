ProfileSidebarModule.controller('ProfileSidebarController', ['$scope', 'TagService', 'user', 'tags',
    function($scope, TagService, user, tags) {
        $scope.user = user;
        $scope.tags = tags;

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) {
                    $scope.tags[index].followed = response.followed;
            });
        }
    }
]);