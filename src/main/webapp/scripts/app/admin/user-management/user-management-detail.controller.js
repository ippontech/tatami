'use strict';

tatamiJHipsterApp
    .controller('UserManagementDetailController', function ($scope, $stateParams, User) {
        $scope.user = {};
        $scope.load = function (username) {
            User.get({username: username}, function(result) {
                $scope.user = result;
            });
        };
        $scope.load($stateParams.username);
    });
