tatamiJHipsterApp
    .controller('UsersListController', ['$scope','UserService',function($scope, UserService) {

    console.log($scope.$parent.domain.data.domain);

    $scope.followUser = function(user) {

        $scope.email = user.username+"@"+$scope.$parent.domain.data.domain;
        $scope.user = user;
        console.log(user);
        console.log($scope.email);

        $scope.user.friend = UserService.follow(
            { email: $scope.email },
            { friend: !$scope.user.friend, friendShip: $scope.user.friend }
        ).friend;
        console.log($scope.user.friend);
    };

}]);
