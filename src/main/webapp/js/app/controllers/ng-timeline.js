angular.module('Tatami', ['ngResource'])
    .controller('TimelineController', ['$scope', '$resource', function($scope, $resource) {
        var timeline = $resource('/tatami/rest/statuses/home_timeline');
        $scope.tatams = timeline.query();
}]);