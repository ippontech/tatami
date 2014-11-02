SidebarModule.controller('UserController',['$scope', 'ProfileService', function($scope, ProfileService) {
	$scope.user = ProfileService.get();
    $scope.user.avatar = '';
}]);