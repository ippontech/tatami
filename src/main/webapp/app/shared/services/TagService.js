TatamiApp.factory('TagService', ['$resource', function($resource) {
    return $resource('/tatami/rest/tags', null,
    {   
        'get': { method:'GET', params: { tag: '@tag' }, url: '/tatami/rest/tags/:tag' },
        'getTagTimeline': { 
            method:'GET', isArray: true, params: { tag: '@tag' }, url: '/tatami/rest/tags/:tag/tag_timeline',
            transformResponse: function(statuses) {
                statuses = angular.fromJson(statuses);

                for(var i = 0; i < statuses.length; i++) {
                    statuses[i]['avatarURL'] = statuses[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';

                    if(statuses[i].geoLocalization) {
                        var latitude = statuses[i].geoLocalization.split(',')[0].trim();
                        var longitude = statuses[i].geoLocalization.split(',')[1].trim();
                        statuses[i]['locationURL'] = 
                            'https://www.openstreetmap.org/?mlon='
                            + longitude + '&mlat=' + latitude;
                    }
                }

                return statuses;
            }
        },
        'follow': { method:'PUT', params: { tag: '@tag' }, url: '/tatami/rest/tags/:tag' },
        'getPopular': { method: 'GET', isArray: true, url: '/tatami/rest/tags/popular' }
    });
}]);