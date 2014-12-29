TagsModule.controller('TagsController', [
    '$scope',
    'TagService',
    'SearchService',
    'tagList',
    function($scope, TagService, SearchService, tagList) {
        $scope.current = {
            searchString: ''
        };

        $scope.tags = tagList;


        /**
         * Follows an unfollowed tag, or unfollows a followed tag, depending on the current state
         * @param tag
         */

        $scope.followTag = function(tag, index) {
            TagService.follow(
                { tag: tag.name },
                { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp },
                function(response) {
                    $scope.tags[index].followed = response.followed;
            });
        };

        $scope.search = function() {
            // Update the route
            $scope.$state.transitionTo('account.tags.search',
                { q: $scope.current.searchString },
                { location: true, inherit: true, relative: $scope.$state.$current, notify: false });

            // Update the tag data data
            if($scope.current.searchString.length == 0) {
                $scope.tags = {};
            }
            else{
                SearchService.query({term: 'tags', q: $scope.current.searchString }, function(result) {
                    // Now update the tags
                    $scope.tags = result;
                });
            }
        }
    }
]);