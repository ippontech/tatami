SidebarModule.controller('ProfileController', ['$scope', 'ProfileService', function($scope, ProfileService) {
    $scope.profile = ProfileService.get(function() {
        $scope.avatarURL = $scope.profile.avatar=='' ? '/img/default_image_profile.png' : '/tatami/avatar/' + $scope.profile.avatar + '/photo.jpg';
    })
}]);