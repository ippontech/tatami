TatamiApp.factory('StatusService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/statuses/:statusId',
        null,
        {   'getTimeline': { method: 'GET', isArray: true, url: '/tatami/rest/statuses/home_timeline' },
            'update': { method: 'PATCH', params: { statusId: '@statusId' } }
    });
}]);