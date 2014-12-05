AccountModule.controller('AccountController', ['$scope', '$location', 'ProfileService', '$state', function($scope, $location, ProfileService, $state) {
    $scope.$state = $state;
    $scope.profile = ProfileService.get();

    $scope.isActive = function(path) {
        return path === $location.path();
    };

    $scope.selected = function(currentSelection) {
        $scope.selected = currentSelection;
    };
}]);