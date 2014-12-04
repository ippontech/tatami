HomeSidebarModule.controller('ProfileController', ['$scope', 'ProfileService', function($scope, ProfileService) {
    $scope.profile = ProfileService.get();
}]);