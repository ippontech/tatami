UsersModule.controller('UsersController', ['$scope', '$resource', 'ProfileService', function($scope, $resource, ProfileService) {
    $scope.getUsers = function() {
        // Get the user profile (which doesn't contain the login)
        var promise = ProfileService.get();
        promise.$promise.then(function(result) {
            // Use the result of promise (the user profile) to find the login name for the user
            $resource('/tatami/rest/users/:userId/friends').query({ userId: result.username }, function(listOfUsers) {
                $scope.usersGroup = listOfUsers
            });
        });
    };
}]);