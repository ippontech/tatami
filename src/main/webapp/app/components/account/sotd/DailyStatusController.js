DailyStatusModule.controller('DailyStatusController', ['$scope', 'dailyStats', 'DailyStatusData', function($scope, dailyStats, DailyStatusData) {
    $scope.popularUsers = [];
    dailyStats.$promise.then(function(result) {
        return DailyStatusData(result);
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