TatamiApp.factory('StatusService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/statuses/:statusId',
        null,
        { 'favorite': { method:'PATCH', params: { statusId: '@statusId' } }
    });
}]);