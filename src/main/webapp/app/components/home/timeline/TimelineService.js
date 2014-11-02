TimelineModule.factory('TimelineService', ['$resource', function($resource) {
    return $resource('/tatami/rest/statuses/home_timeline');
}]);