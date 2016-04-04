angular.module('tatamiJHipsterApp')
.controller('WelcomeController', ['$scope', '$uibModalInstance', '$rootScope', function($scope, $uibModalInstance, $rootScope) {
    $scope.close = function() {
        $uibModalInstance.dismiss();
    };

    $scope.launchPresentation = function() {
        $rootScope.$broadcast('start-tour');
        $uibModalInstance.dismiss();
    };

    // Handles closing the modal via escape and clicking outside the modal
    $uibModalInstance.result.finally(function() {
        $scope.$state.go('timelineHome.sidebarHome.timeline');
    });
}]);
