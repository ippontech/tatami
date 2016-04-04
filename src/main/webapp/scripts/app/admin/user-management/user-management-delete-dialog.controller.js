'use strict';

tatamiJHipsterApp
	.controller('user-managementDeleteController', function($scope, $uibModalInstance, entity, User) {

        $scope.user = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (username) {
            User.delete({username: username},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
