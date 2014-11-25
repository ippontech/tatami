TagModule.controller('TagController', ['$scope', 'TagService', '$resource', function ($scope, TagService, $resource){
    /**
     * Initialization function. Gets the tags immediately, this may be something can be resolved in routing
     * @returns {*}
     */
    $scope.getTags = function (){
        // Factor into a service
        var promise = $resource('/tatami/rest/tags/popular').query(function(result){
            $scope.tags = result;
        });
        return promise;
    };

    /**
     * Follows an unfollowed tags, or unfollows a followed tab, depending on the current state
     * @param tag
     */
    $scope.follow = function(tag){
        tag.followed = !tag.followed;
        var promise = $resource('/tatami/rest/tags/' + tag.name, null,
            {
                'update': {method: 'PUT'}
            }).update(tag);
    };
}]);