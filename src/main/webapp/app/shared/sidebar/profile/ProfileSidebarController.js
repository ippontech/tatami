ProfileSidebarModule.controller('ProfileSidebarController', ['$scope', '$stateParams', 'UserService', 'TagService', function($scope, $stateParams, UserService, TagService) {
    $scope.profile = UserService.get({ username: $stateParams.username });
}]);