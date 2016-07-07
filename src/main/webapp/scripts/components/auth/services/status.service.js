angular.module('tatamiJHipsterApp')
.factory('StatusService', ['$resource', 'GeolocalisationService', function($resource, GeolocalisationService) {
    var responseTransform = function(statuses) {
        statuses = angular.fromJson(statuses);

        for(var i = 0; i < statuses.length; i++) {
            statuses[i]['avatarURL'] = !statuses[i].avatar ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';
            updateGeoLocInfo(statuses[i]);
        }

        return statuses;
    };

    var updateGeoLocInfo = function (status) {
        if (status.geoLocalization) {
            status.locationURL = GeolocalisationService.getGeolocUrl(status.geoLocalization);
        }
    };

    return $resource('/tatami/rest/statuses/:statusId', null,
    {
        'get': {
            method: 'GET',
            transformResponse: function(status) {
                status = angular.fromJson(status);

                status.avatarURL = !status.avatar ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + status.avatar + '/photo.jpg';

                updateGeoLocInfo(status);

                return status;
             }
        },
        'getHomeTimeline': {
            method: 'GET', isArray: true, url: '/tatami/rest/statuses/home_timeline',
            transformResponse: responseTransform
        },
        'getCompanyTimeline': {
            method: 'GET', isArray: true, url: '/tatami/rest/statuses/domain_timeline',
            transformResponse: responseTransform
        },
        'getUserTimeline': {
            method: 'GET', isArray: true, params: { email: '@email' }, url: '/tatami/rest/statuses/:email/timeline',
            transformResponse: responseTransform
        },
        'getDetails': {
            method: 'GET', params: { statusId: '@statusId' }, url: '/tatami/rest/statuses/details/:statusId',
            transformResponse: function(details) {
                details = angular.fromJson(details);

                for(var i = 0; i < details.discussionStatuses.length; i++) {
                    details.discussionStatuses[i]['avatarURL'] = !details.discussionStatuses[i].avatar.avatar ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + details.discussionStatuses[i].avatar + '/photo.jpg';
                    updateGeoLocInfo(details.discussionStatuses[i])
                }

                for(var i = 0; i < details.sharedByEmails.length; i++) {
                    details.sharedByEmails[i]['avatarURL'] = !details.sharedByEmails[i].avatar ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + details.sharedByEmails[i].avatar + '/photo.jpg';
                }

                return details;
            }
        },
        'update': { method: 'PATCH', params: { statusId: '@statusId' } },
        'announce': { method: 'PATCH', params: { params: '@statusId' } }
    });
}]);
