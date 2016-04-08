'use strict';

tatamiJHipsterApp
	.controller('user-managementDeleteController', function($scope, $uibModalInstance, entity, UserService) {

        $scope.user = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (login) {
            UserService.delete({username: login},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
