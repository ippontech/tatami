'use strict';

tatamiJHipsterApp
	.controller('user-managementDeleteController', function($scope, $uibModalInstance, entity, UserService) {

        $scope.user = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (email) {
            UserService.delete({email: email},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
