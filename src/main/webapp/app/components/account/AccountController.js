AccountModule.controller('AccountController', ['$scope', '$routeParams', 'ProfileService', function($scope, $routeParams, ProfileService) {
    $scope.init = function() {
        ProfileService.get(function(result) {
            $scope.user = result;
            temp = result.avatar=='' ? '/img/default_image_profile.png' : '/tatami/avatar/' + result.avatar + '/photo.jpg';
            $scope.setAvatar(temp);
        })
    };

    $scope.init();

    $scope.setAvatar = function(avatarURL) {
        $scope.avatarURL = avatarURL;
    };

    $scope.selected = function(currentSelection) {
        $scope.selected = currentSelection;
    };

    $scope.setPath = function() {
        if($routeParams.accountPage == 'profile') { return 'ProfileView' }
        else if($routeParams.accountPage == 'preferences') { return 'PreferencesView' }
        else if($routeParams.accountPage == 'password') { return 'PasswordView' }
        else if($routeParams.accountPage == 'files') { return 'FilesView' }
        else if($routeParams.accountPage == 'users') { return 'UsersView' }
        else if($routeParams.accountPage == 'groups') { return 'GroupsView' }
        else if($routeParams.accountPage == 'tags') { return 'TagsView' }
        else if($routeParams.accountPage == 'sotd') { return 'DailyStatusView'}
        else return '';
    };
    $scope.currentPage = $routeParams.accountPage;
    $scope.accountPath = '/app/components/account/' + $routeParams.accountPage + '/' + $scope.setPath() + '.html';
}]);