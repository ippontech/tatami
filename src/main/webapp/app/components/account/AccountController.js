AccountModule.controller('AccountController', ['$scope', 'ProfileService', '$routeParams', function($scope, ProfileService, $routeParams) {
    $scope.init = function (){
        ProfileService.get(function (result){
            $scope.user = result;
            temp = result.avatar=='' ? '/img/default_image_profile.png' : '/tatami/avatar/' + result.avatar + '/photo.jpg';
            $scope.setAvatar(temp);
        })
    };

    $scope.init();

    $scope.setAvatar = function(avatarUrl) {
        $scope.avatarUrl = avatarUrl;
    };

    $scope.selected = function(currentSelection) {
        $scope.selected = currentSelection;
    };

    $scope.setPath = function() {
        if($routeParams.accountPage == 'profile') { return 'ProfileView' }
        else if($routeParams.accountPage == 'preferences') { return 'PreferenceView' }
        else if($routeParams.accountPage == 'password') { return 'PasswordView' }
        else if($routeParams.accountPage == 'files') { return 'FileView' }
        else if($routeParams.accountPage == 'users') { return 'UsersView' }
        else if($routeParams.accountPage == 'groups') { return 'GroupsView' }
        else if($routeParams.accountPage == 'tags') { return 'TagView' }
        else if($routeParams.accountPage == 'status_of_the_day') { return 'DailyStatusView'}
        else return '';
    };
    $scope.currentPage = $routeParams.accountPage;
    $scope.accountPath = '/app/components/account/' + $routeParams.accountPage + '/' + $scope.setPath() + '.html';
}]);