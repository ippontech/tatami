DailyStatusModule.controller('DailyStatusController', ['$scope', 'dailyStats', 'UserService', function($scope, dailyStats, UserService) {
    $scope.popularUsers = [];

    $scope.getUser = function(i, count) {
        UserService.get({ username: dailyStats[i].username }, function(result) {
            $scope.popularUsers.push([result, count]);
        })
    };

    for(var i = 0; i < dailyStats.length; ++i) {
        $scope.getUser(i, dailyStats[i].statusCount);
    }

    $scope.sortedUsers = function(list) {
        list.sort(function(a, b) {
            return a[1] < b[1] ? -1 : 1;
        });
    }
}]);