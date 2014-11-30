TatamiApp.factory('TagService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/tags/:tag',
        { },
        { 'follow': { method:'PUT', params: { tag: '@tag' } }
    });
}]);