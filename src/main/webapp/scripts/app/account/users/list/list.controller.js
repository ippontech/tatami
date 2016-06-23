tatamiJHipsterApp
    .controller('UsersListController', ['$scope','UserService',function($scope, UserService) {


    $scope.followUser = function(user) {

        $scope.email = user.username+"@"+$scope.$parent.domain.data.domain;
        $scope.user = user;

        $scope.user.friend = UserService.follow(
            { email: $scope.email },
            { friend: !$scope.user.friend, friendShip: $scope.user.friend }
        ).friend;
    };

}]);
