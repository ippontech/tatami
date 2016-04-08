'use strict';

tatamiJHipsterApp
    .controller('UserManagementDetailController', function ($scope, $stateParams, UserService) {
        $scope.user = {};
        $scope.load = function (login) {

            UserService.get({username: login}, function(result) {

                $scope.user = result;
            });
        };
        $scope.load($stateParams.login);
    });
