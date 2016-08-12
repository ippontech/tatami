'use strict';

tatamiJHipsterApp.controller('UserManagementDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'UserService', 'Language',
        function($scope, $stateParams, $uibModalInstance, entity, User, Language) {

        $scope.user = entity;
            User.get({email: $stateParams.email}, function(result) {
                $scope.user = result;
            });
        $scope.authorities = ["ROLE_USER", "ROLE_ADMIN"];
        Language.getAll().then(function (languages) {
            $scope.languages = languages;
            if (!$scope.user.langKey){
                $scope.user.langKey = $scope.languages[0];
            }
        });
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.user.id != null) {
                User.update($scope.user, onSaveSuccess, onSaveError);
            } else {
                User.save($scope.user, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
