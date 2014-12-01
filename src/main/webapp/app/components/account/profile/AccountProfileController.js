/**
 * There is a lot of logic in this controller. Running into some issues with the ProfileService. In the future,
 * the extra logic will be factored into ProfileService.
 */

ProfileModule.controller('AccountProfileController', ['$scope', 'ProfileService', '$resource', 'UserService', function($scope, ProfileService, $resource, UserService) {

    $scope.init = function() {
        ProfileService.get(function(result) {
            $scope.userProfile = result;
            UserService.get({username: result.username}, function(user){
            $scope.userLogin = user.login;
            });
        });
    };

    $scope.init();

    $scope.updateUser = function (){
        ProfileService.update($scope.userProfile);
    };

    $scope.deleteUser = function(confirmMessage) {
        if(confirm(confirmMessage)) {
            // Backend doesn't handle this correctly atm
            //ProfileService.delete();
            // Display success/failure message
        }
    }
}]);