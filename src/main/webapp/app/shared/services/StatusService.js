TatamiApp.factory('StatusService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/statuses/:statusId', null,
        {   
            'update': { method: 'PATCH', params: { statusId: '@statusId' } }
        });
}]);