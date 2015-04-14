HomeModule.controller('WelcomeController', ['$scope', '$modalInstance', function($scope, $modalInstance) {
    $scope.close = function() {
        $modalInstance.dismiss();
        $modalInstance.result.then(function() {
            $rootScope.$state.go('^');
        })
    };

    $scope.launchPresentation = function() {
        console.log($scope.tour);
        $modalInstance.dismiss();
        $modalInstance.result.then(function() {
            $rootScope.$state.go('^');
            // Now start the presentation

        })
    };

    // Handles closing the modal via escape and clicking outside the modal
    $modalInstance.result.finally(function() {
        $scope.$state.go('tatami.home.home.timeline');
    })
}]);