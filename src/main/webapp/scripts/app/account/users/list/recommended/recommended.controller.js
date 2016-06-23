tatamiJHipsterApp
    .controller('UsersRecommendedController', ['$scope', 'usersList', function($scope, usersList) {
        $scope.usersList = usersList;
    }]);
