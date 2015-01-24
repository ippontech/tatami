TatamiApp.factory('TopPostersService', ['$resource', function($resource) {
    return $resource('/tatami/rest/stats/day');
}]);