ProfileSidebarModule.controller('ProfileSidebarController', ['$scope', '$rootScope', 'UserService', 'TagService',
    function($scope, $rootScope, UserService, TagService) {
        $scope.profile = UserService.get({ username: $rootScope.$stateParams.username });

        $scope.tags = TagService.query({ popular: true, user: $rootScope.$stateParams.username });

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) {
                    $scope.tags[index].followed = response.followed;
            });
        }
    }
]);