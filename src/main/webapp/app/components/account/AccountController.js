AccountModule.controller('AccountController', ['$scope', '$routeParams', 'ProfileService', '$location', function($scope, $routeParams, ProfileService, $location) {
    $scope.init = function() {
        ProfileService.get(function(result) {
            $scope.user = result;
            temp = result.avatar=='' ? '/img/default_image_profile.png' : '/tatami/avatar/' + result.avatar + '/photo.jpg';
            $scope.setAvatar(temp);
        })
    };

    $scope.isActive = function (path) {
        return path === $location.path();
    };

    $scope.init();

    $scope.setAvatar = function(avatarURL) {
        $scope.avatarURL = avatarURL;
    };

    $scope.selected = function(currentSelection) {
        $scope.selected = currentSelection;
    };
}]);