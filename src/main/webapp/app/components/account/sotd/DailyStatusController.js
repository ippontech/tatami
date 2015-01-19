DailyStatusModule.controller('DailyStatusController', ['$scope', 'dailyStats', 'UserService', function($scope, dailyStats, UserService) {
    $scope.popularUsers = [];
    dailyStats.$promise.then(function(result) {
        var data = [];
        for(var i = 0; i < result.length; ++i) {
            data.push(UserService.get({ username: result[i].username }));
            data[i].dailyCount = result[i].statusCount;
        }
        return data;
    }).then(function(popularUsers) {
        popularUsers.sort(function(a, b) {
            return a.dailyCount < b.dailyCount ? 1 : -1;
        });
        /* Not ideal. Even though popularUsers[i].dailyCount exists, inserting
        * {{ user.dailyCount }} in the html does not display the count. The work around
        * is to create a 2 dimensional array
         */
        for(var i = 0; i < popularUsers.length; ++i) {
            $scope.popularUsers.push([popularUsers[i], popularUsers[i].dailyCount]);
        }
    });
}]);