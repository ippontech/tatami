AccountModule.controller('AccountController', ['$scope', '$location', 'profileInfo', function($scope, $location, profileInfo) {
    $scope.profile = profileInfo;

    $scope.isActive = function(path) {
        return path === $location.path();
    };

    $scope.selected = function(currentSelection) {
        $scope.selected = currentSelection;
    };
}]);