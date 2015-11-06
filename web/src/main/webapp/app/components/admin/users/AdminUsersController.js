AdminModule.controller('AdminUsersController', [
    '$scope',
    'UserService',
    'users',
    function($scope, UserService, users) {
        $scope.users = users;

        $scope.searchUsers = function() {
            if ($scope.search === '') {
                $scope.users = UserService.query();
            } else {
                $scope.users = UserService.searchUsers({ q:$scope.search });
            }
        }
    }]);