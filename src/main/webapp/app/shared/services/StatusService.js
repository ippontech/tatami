TatamiApp.factory('StatusService', ['$resource', function($resource) {
    return resource = $resource(
        '/tatami/rest/statuses/:statusId',
        { },
        { 'update': { method:'PATCH', params: { statusId: '@statusId' } }
    });
}]);