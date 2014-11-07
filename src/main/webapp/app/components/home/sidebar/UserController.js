SidebarModule.controller('UserController', ['$scope', 'ProfileService', function($scope, ProfileService) {
    $scope.user = ProfileService.get(function() {
        $scope.avatarURL = $scope.user.avatar=='' ? '/img/default_image_profile.png' : '/tatami/avatar/' + $scope.user.avatar + '/photo.jpg';
    })
}]);