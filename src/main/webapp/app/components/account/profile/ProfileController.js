/**
 * There is a lot of logic in this controller. Running into some issues with the ProfileService. In the future,
 * the extra logic will be factored into ProfileService.
 */

ProfileModule.controller('ProfileController', ['$scope', '$resource', 'ProfileService', 'UserService', 
    function($scope, $resource, ProfileService, UserService) {

        $scope.init = function() {
            ProfileService.get(function(result) {
                $scope.userProfile = result;
                UserService.get({ username: result.username }, function(user) {
                    $scope.userLogin = user.login;
                });
            });
        };

        $scope.init();

        $scope.updateUser = function() {
            ProfileService.update($scope.userProfile);
        };

        // This is currently disabled until the back end is fixed to handle this correctly
        $scope.deleteUser = function(confirmMessage) {
            // Switch to a confirmation modal later
            if(confirm(confirmMessage)) {
                // ProfileService.delete();
                // Display success/failure message
            }
        }
    }
]);