TagModule.controller('TagController', ['$scope', 'TagService', '$resource', function ($scope, TagService, $resource){
    $scope.getTags = function (){
        // Factor into a service
        var promise = $resource('/tatami/rest/tags/popular').query(function(result){
            $scope.tags = result;
        });
        return promise;
    };

    $scope.follow = function(tag){
        tag.followed = !tag.followed;
        var promise = $resource('/tatami/rest/tags/' + tag.name, null,
            {
                'update': {method: 'PUT'}
            }).update(tag);
    };
}]);