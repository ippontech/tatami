angular.module('Tatami', ['ngResource'])
    .controller('TimelineController', function($scope, $resource) {
        var timeline = $resource('/tatami/rest/statuses/home_timeline');
        $scope.tatams = timeline.query();
});