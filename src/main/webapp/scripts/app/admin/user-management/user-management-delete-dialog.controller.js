'use strict';

tatamiJHipsterApp
	.controller('user-managementDeleteController', function($scope, $uibModalInstance, entity, User) {

        $scope.user = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (email) {
            User.delete({email: email},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
