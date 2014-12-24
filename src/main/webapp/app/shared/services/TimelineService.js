TatamiApp.factory('TimelineService', ['$resource', function($resource) {
    var responseTransform = function(statuses, headersGetter) {
        statuses = angular.fromJson(statuses);

        for(var i = 0; i < statuses.length; i++) {
            statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';

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

    return $resource(
        null,
        null,
        {   'getTimeline': { 
            method: 'GET', isArray: true, url: '/tatami/rest/statuses/home_timeline',
            transformResponse: responseTransform },
            'getMentions': { 
            method: 'GET', isArray: true, url: '/tatami/rest/mentions',
            transformResponse: responseTransform },
            'getFavorites': { 
            method: 'GET', isArray: true, url: '/tatami/rest/favorites',
            transformResponse: responseTransform },
            'getCompanyWall': { 
            method: 'GET', isArray: true, url: '/tatami/rest/company',
            transformResponse: responseTransform }
         });
}]);