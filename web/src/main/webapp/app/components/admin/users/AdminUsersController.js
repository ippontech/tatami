AdminModule.controller('AdminUsersController', [
    '$scope',
    '$translate',
    '$window',
    'users',
    function($scope, $translate, $window, users) {
        $scope.users = users;
    }]);