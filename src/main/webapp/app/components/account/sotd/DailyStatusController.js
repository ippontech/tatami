DailyStatusModule.controller('DailyStatusController', ['$scope', 'dailyStats', function($scope, dailyStats) {
    $scope.popularUsers = dailyStats;
}]);