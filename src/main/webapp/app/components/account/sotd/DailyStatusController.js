DailyStatusModule.controller('DailyStatusController', ['$scope', 'dailyStats', 'UserService', 'userData', function($scope, dailyStats, UserService, userData) {
    $scope.popularUsers = userData;

    $scope.popularUsers.sort(function(a, b) {
        return a.dailyCount < b.dailyCount ? 1 : -1;
    });
}]);