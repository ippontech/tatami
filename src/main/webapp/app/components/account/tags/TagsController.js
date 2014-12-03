TagsModule.controller('TagsController', ['$scope', '$resource', 'TagService', '$location', '$resource', '$state', function($scope, $resource, TagService, $location, $resource, $state) {
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

    /**
     * Perhaps this isn't the best way, but when we switch tabs, the view stays the same, except the model data
     * changes. The routing is set up in such a way that the url for the new data is made available to the controller
     * through toState.data.dataUrl. Now we can perform a query on this url.
     */
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
        $resource(toState.data.dataUrl).query(function(result) {
            $scope.tags = result;
        });
    });

    $scope.isActive = function (path){
        return path === $location.path();
    };

    /**
     * Follows an unfollowed tag, or unfollows a followed tag, depending on the current state
     * @param tag
     */
    $scope.follow = function(tag) {
        tag.followed = !tag.followed;
        var promise = $resource('/tatami/rest/tags/' + tag.name, null,
            {
                'update': {method: 'PUT'}
            }).update(tag);
    };
}]);