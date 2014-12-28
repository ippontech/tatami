TagsModule.controller('TagsController', [
    '$scope',
    '$resource',
    '$location',
    '$resource',
    'TagService',
    'SearchService',
    'tagList',
    function($scope, $resource, $location, $resource, TagService, SearchService, tagList) {
        $scope.current = {
            searchString: ''
        };
        /**
         * Initialization function. Gets the tags immediately, this may be something can be resolved in routing
         * @returns {*}
         */
        $scope.getTags = function() {
            // Factor into a service
            var promise = $resource('/tatami/rest/tags/popular').query(function(result) {
                $scope.tags = result;
            });
            return promise;
        };

        $scope.tags = tagList;

        $scope.isActive = function (path) {
            return path === $location.path();
        };

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

        $scope.contains = function(path) {
            return $location.path().contains(path);
        };

        $scope.search = function() {
            console.log($scope.$state.current.name);
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