TatamiApp.factory('TagService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/tags',
        null,
        { 'follow': { method:'PUT', params: { tag: '@tag' }, url: '/tatami/rest/tags/:tag' }
    });
}]);