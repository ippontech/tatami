UsersModule.controller('UsersController', ['$scope', '$resource', 'UserService', 'ProfileService', '$location', function($scope, $resource, UserService, ProfileService, $location) {
    /**
     * Ideally this would be done during routing
     */
    $scope.getUsers = function() {
        ProfileService.get().$promise.then(function(result) {
            UserService.getFriends({ userId: result.username }, function (friendList){
                $scope.usersGroup = friendList;
            });
        })
    };

    /**
     * If toState.data.dataUrl is undefined, it means we are get the user friends, and so we call $scope.getUsers(),
     * If however, a valid url is passed in, we will query that path.
     */
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
        if(toState.data.dataUrl == "search"){
            $scope.userGroups = {};
        }
        else if(toState.data.dataUrl) {
            $resource(toState.data.dataUrl).query(function(result) {
                $scope.userGroups = result;
            });
        }
        else {
            $scope.getUsers();
        }
    });

    $scope.isActive = function(path) {
        return path === $location.path();
    };
}]);