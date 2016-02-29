angular.module('tatamiJHipsterApp')
.controller('WelcomeController', ['$scope', '$modalInstance', '$rootScope', function($scope, $modalInstance, $rootScope) {
    $scope.close = function() {
        $modalInstance.dismiss();
    };

    $scope.launchPresentation = function() {
        $rootScope.$broadcast('start-tour');
        $modalInstance.dismiss();
    };

    // Handles closing the modal via escape and clicking outside the modal
    $modalInstance.result.finally(function() {
        $scope.$state.go('timelineHome.sidebarHome.timeline');
    });
}]);
