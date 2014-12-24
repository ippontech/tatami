HomeModule.controller('TagHeaderController', ['$scope', 'TagService', 'tag',
    function($scope, TagService, tag) {
        $scope.tag = tag;

        $scope.followTag = function() {
            TagService.follow(
                { tag: $scope.tag.name },
                { name: $scope.tag.name, followed: !$scope.tag.followed, trendingUp: $scope.tag.trendingUp },
                function(response) {
                    $scope.tag.followed = response.followed;
                }
            );
        }
    }
]);