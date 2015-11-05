AdminModule.controller('AdminUsersController', [
    '$scope',
    '$translate',
    '$window',
    'UserService',
    'users',
    function($scope, $translate, $window, UserService, users) {
        $scope.users = users;

        $scope.searchUsers = function() {
            if ($scope.search === '') {
                $scope.users = UserService.query();
            } else {
                $scope.users = UserService.searchUsers({ q:$scope.search });
            }
        }
    }]);