AccountModule.controller('AccountController', ['$scope', 'ProfileService', function($scope, ProfileService) {
    $scope.user = ProfileService.get(function() {
        temp = $scope.user.avatar=='' ? '/img/default_image_profile.png' : '/tatami/avatar/' + $scope.user.avatar + '/photo.jpg';
        $scope.setAvatar(temp);
    });
    $scope.avatarUrl = '',

    $scope.setAvatar = function(avatarUrl) {
        $scope.avatarUrl = avatarUrl;
    }
}]);