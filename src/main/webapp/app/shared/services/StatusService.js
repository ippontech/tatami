TatamiApp.factory('StatusService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/statuses/:statusId',
        null,
        {   'getTimeline': { 
            method: 'GET', isArray: true, url: '/tatami/rest/statuses/home_timeline',
            transformResponse: function(statuses, headersGetter) {
                    statuses = angular.fromJson(statuses);

                    for(var i = 0; i < statuses.length; i++) {
                        statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';
                    }

                    return statuses;
             } },
            'update': { method: 'PATCH', params: { statusId: '@statusId' } }
    });
}]);