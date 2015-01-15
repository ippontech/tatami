TatamiApp.factory('DailyStatusService', ['$resource', function($resource) {
    return $resource('/tatami/rest/stats/day');
}]);