/**
 * There is a lot of logic in this controller. Running into some issues with the ProfileService. In the future,
 * the extra logic will be factored into ProfileService.
 */

ProfileModule.controller('ProfileController', ['$scope', 'ProfileService', '$resource', function($scope, ProfileService, $resource){

    $scope.init = function(){
        // Get the user profile (which doesn't contain the login)
        var promise = ProfileService.get();
        promise.$promise.then(function(result){
            $scope.userProfile = result;
            // Use the result of promise (the user profile) to find the login name for the user
            $resource('/tatami/rest/users/:userId').get({userId: result.username}, function(user){
                $scope.userLogin = user.login;
            });
        });
    };

    $scope.updateUser = function (){
        $resource('/tatami/rest/account/profile', null,
            {
                'update': {method: 'PUT'}
            }).update($scope.userProfile);
        // Display success message
    };

    $scope.display = function(){
        console.log($scope.userProfile);
    }

    $scope.deleteUser = function (confirmMessage){
        if(confirm(confirmMessage)){
            console.log('Deleting');
            ProfileService.delete();
            // Display success/failure message
        }
    }
}]);