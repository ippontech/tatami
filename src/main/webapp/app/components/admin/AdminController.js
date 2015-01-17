AdminModule.controller('AdminController', ['$scope', '$translate', function($scope, $translate) {
    $scope.reindex = function() {
        confirm($translate.instant('tatami.admin.confirm'));
    }
}]);