HomeSidebarModule.controller('TrendsController', ['$scope', 'TagService', function($scope, TagService) {
	$scope.tags = TagService.query({ popular: true });

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