UsersModule.controller('UsersController', ['$scope', '$resource', 'ProfileService', 'usersData', '$location', function($scope, $resource, ProfileService, usersData, $location) {
    $scope.getUsers = function() {
        $resource('/tatami/rest/users/:userId/friends').query({ userId: usersData.username }, function (result){
            $scope.usersGroup = result;
        })
    };
    $scope.getUsers();

    $scope.isActive = function(path) {
        return path === $location.path();
    };
    /*
    $scope.getUsers = function() {
        // Get the user profile (which doesn't contain the login)
        var promise = ProfileService.get();
        promise.$promise.then(function(result) {
            // Use the result of promise (the user profile) to find the login name for the user
            $resource('/tatami/rest/users/:userId/friends').query({ userId: result.username }, function(listOfUsers) {
                $scope.usersGroup = listOfUsers
            });
        });
    };*/
}]);