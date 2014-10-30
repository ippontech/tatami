tatamiApp.controller('TimelineController', ['$scope', '$resource', function($scope, $resource) {
        var timeline = $resource('/tatami/rest/statuses/home_timeline');
        $scope.tatams = timeline.query();

        var profile = $resource('/tatami/rest/account/profile');
        $scope.profileInfo = profile.get();
}]);