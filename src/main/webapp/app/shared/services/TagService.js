TatamiApp.factory('TagService', ['$resource', function($resource) {
    return $resource('/tatami/rest/tags:popular');
}]);