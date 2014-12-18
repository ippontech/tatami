ProfileSidebarModule.controller('ProfileSidebarController', ['$scope', '$stateParams', 'UserService', 'TagService', 
    function($scope, $stateParams, UserService, TagService) {
        $scope.profile = UserService.get({ username: $stateParams.username });

        $scope.tags = TagService.query({ popular: true, user: $stateParams.username });

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) {
                    $scope.tags[index].followed = response.followed;
            });
        }
    }
]);