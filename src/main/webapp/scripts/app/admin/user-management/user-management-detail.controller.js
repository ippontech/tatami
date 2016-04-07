'use strict';

tatamiJHipsterApp
    .controller('UserManagementDetailController', function ($scope, $stateParams, User) {
        $scope.user = {};
        $scope.load = function (email) {
            User.get({email: email}, function(result) {
                $scope.user = result;
            });
        };
        $scope.load($stateParams.email);
    });
