HomeModule.controller('WelcomeController', ['$scope', '$modalInstance', function($scope, $modalInstance) {
    $scope.close = function() {
        $modalInstance.dismiss();
        $modalInstance.result.then(function() {
            $rootScope.$state.go('^');
        })
    };

    $scope.launchPresentation = function() {
        $modalInstance.dismiss();
        $modalInstance.result.then(function() {
            $rootScope.$state.go('^');
            // Now start the presentation
        })
    }
}]);