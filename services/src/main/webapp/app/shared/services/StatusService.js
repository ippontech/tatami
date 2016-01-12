TatamiApp.factory('StatusService', ['$resource', function($resource) {
    var responseTransform = function(statuses) {
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
    };

    return $resource('/tatami/rest/statuses/:statusId', null,
    {
        'get': {
            method: 'GET',
            transformResponse: function(status) {
                status = angular.fromJson(status);

                status.avatarURL = status.avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + status.avatar + '/photo.jpg';

                if(status.geoLocalization) {
                    var latitude = status.geoLocalization.split(',')[0].trim();
                    var longitude = status.geoLocalization.split(',')[1].trim();
                    status['locationURL'] =
                        'https://www.openstreetmap.org/?mlon='
                        + longitude + '&mlat=' + latitude;
                }

                return status;
             }
        },
        'getHomeTimeline': {
            method: 'GET', isArray: true, url: '/tatami/rest/statuses/home_timeline',
            transformResponse: responseTransform
        },
        'getUserTimeline': {
            method: 'GET', isArray: true, params: { username: '@username' }, url: '/tatami/rest/statuses/:username/timeline',
            transformResponse: responseTransform
        },
        'getDetails': {
            method: 'GET', params: { statusId: '@statusId' }, url: '/tatami/rest/statuses/details/:statusId',
            transformResponse: function(details) {
                details = angular.fromJson(details);

                for(var i = 0; i < details.discussionStatuses.length; i++) {
                    details.discussionStatuses[i]['avatarURL'] = details.discussionStatuses[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + details.discussionStatuses[i].avatar + '/photo.jpg';

                    if(details.discussionStatuses[i].geoLocalization) {
                        var latitude = details.discussionStatuses[i].geoLocalization.split(',')[0].trim();
                        var longitude = details.discussionStatuses[i].geoLocalization.split(',')[1].trim();
                        details.discussionStatuses[i]['locationURL'] =
                            'https://www.openstreetmap.org/?mlon='
                            + longitude + '&mlat=' + latitude;
                    }
                }

                for(var i = 0; i < details.sharedByLogins.length; i++) {
                    details.sharedByLogins[i]['avatarURL'] = details.sharedByLogins[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + details.sharedByLogins[i].avatar + '/photo.jpg';
                }

                return details;
            }
        },
        'update': { method: 'PATCH', params: { statusId: '@statusId' } },
        'announce': { method: 'PATCH', params: { params: '@statusId' } }
    });
}]);
