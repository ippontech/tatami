ProfileSidebarModule.controller('ProfileTrendsController', ['$scope', '$stateParams', 'TagService', function($scope, $stateParams, TagService) {
    $scope.tags = TagService.query({ popular: true, user: $stateParams.username });

    $scope.followTag = function(tag) {
        TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
            function(response) { 
                var index = $scope.tags.indexOf(tag);
                $scope.tags[index] = response;
                // should I only update the followed property of the tag 
                // or update the whole tag in the model?
        });
    }
}]);