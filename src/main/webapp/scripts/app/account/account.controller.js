tatamiJHipsterApp.controller('AccountController', ['$scope', '$location', 'profileInfo', function($scope, $location, profileInfo) {
    $scope.profile = profileInfo.data;
    console.log($scope.profile);
}]);
