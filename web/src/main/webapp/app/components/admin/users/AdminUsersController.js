AdminModule.controller('AdminUsersController', [
    '$scope',
    '$translate',
    'UserService',
    'AdminService',
    'users',
    'ngToast',
    function($scope, $translate, UserService, AdminService, users, ngToast) {
        $scope.users = users;

        $scope.searchUsers = function() {
            if ($scope.search === '') {
                $scope.users = UserService.query();
            } else {
                $scope.users = UserService.searchUsers({ q:$scope.search });
            }
        };

        $scope.isAdmin = function(user) {
            return !$scope.adminOnly || user.admin;
        };

        $scope.toggleAdmin = function(user) {
            AdminService.toggleAdmin({ login: user.login, admin: !user.admin }, function() {
                ngToast.create({
                    content: $translate.instant('tatami.admin.toggleAdminSuccess')
                });
                user.admin = !user.admin;
            }, function(response) {
                ngToast.create({
                    content: response.data.error || $translate.instant('tatami.error'),
                    className: 'danger'
                });
            });
        }
    }]);