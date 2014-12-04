AccountModule.controller('AccountController', ['$scope', '$location', 'ProfileService', function($scope, $location, ProfileService) {
    $scope.profile = ProfileService.get();

    $scope.isActive = function(path) {
        return path === $location.path();
    };

    $scope.selected = function(currentSelection) {
        $scope.selected = currentSelection;
    };
}]);