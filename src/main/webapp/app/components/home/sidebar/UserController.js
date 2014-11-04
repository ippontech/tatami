SidebarModule.controller('UserController', ['$scope', 'ProfileService', function($scope, ProfileService) {
    $scope.avatarUrl = '/img/default_image_profile.png',
    $scope.user = ProfileService.get(function() {
        $scope.avatarUrl = $scope.user.avatar=='' ? $scope.avartarUrl : '/tatami/avatar/' + $scope.user.avatar + '/photo.jpg';
    })
}]);