TopPostersModule.controller('TopPostersController', ['$scope', 'topPosters', 'UserService', 'userData', function($scope, topPosters, UserService, userData) {
    $scope.topPosters = userData;

    $scope.topPosters.sort(function(a, b) {
        return a.statusCount < b.statusCount ? 1 : -1;
    });
}]);