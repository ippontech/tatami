ProfileSidebarModule.controller('ProfileSidebarController', ['$scope', 'UserService', 'TagService', function($scope, UserService, TagService) {
	$scope.user = UserService.get({ username: 'username' }, null, function() {
        $scope.avatarURL = $scope.user.avatar=='' ? '/img/default_image_profile.png' : '/tatami/avatar/' + $scope.user.avatar + '/photo.jpg';
    });

    $scope.tags = TagService.query({ popular: true });
    //get popular tags for particular user?
}]);