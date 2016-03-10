AccountModule.controller('AccountController', ['$scope', '$location', 'profileInfo', 'Account', 'userLogin', 'ProfileService', 'ngToast',
    function($scope, $location, profileInfo) {
    $scope.profile = profileInfo;
}]);
