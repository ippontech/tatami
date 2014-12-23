TatamiApp.factory('StatusService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/statuses/:statusId', null,
        {   'get': { 
            method: 'GET',
            transformResponse: function(status, headersGetter) {
                status = angular.fromJson(status);
                status.avatarURL = status.avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + status.avatar + '/photo.jpg';
                return status;
             } },
            'update': { method: 'PATCH', params: { statusId: '@statusId' } }
        });
}]);