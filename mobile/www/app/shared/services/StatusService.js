(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('StatusService', statusService);

    statusService.$inject = ['$resource', 'PathService'];
    function statusService($resource, PathService) {
        var responseTransform = function (statuses) {
            statuses = angular.fromJson(statuses);

            for (var i = 0; i < statuses.length; i++) {
                statuses[i]['avatarURL'] = PathService.getAvatar(statuses[i]);

                if (statuses[i].geoLocalization) {
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
                    cache: false,
                    transformResponse: function (status) {
                        status = angular.fromJson(status);

                        status.avatarURL = PathService.getAvatar(status);

                        if (status.geoLocalization) {
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
                    method: 'GET',
                    isArray: true,
                    url: '/tatami/rest/statuses/home_timeline',
                    cache: false,
                    transformResponse: responseTransform
                },
                'getUserTimeline': {
                    method: 'GET',
                    isArray: true,
                    params: {username: '@username'},
                    url: '/tatami/rest/statuses/:username/timeline',
                    cache: false,
                    transformResponse: responseTransform
                },
                'getDetails': {
                    method: 'GET',
                    params: {statusId: '@statusId'},
                    url: '/tatami/rest/statuses/details/:statusId',
                    cache: false,
                    transformResponse: function (details) {
                        details = angular.fromJson(details);

                        for (var i = 0; i < details.discussionStatuses.length; i++) {
                            details.discussionStatuses[i]['avatarURL'] = PathService.getAvatar(details.discussionStatuses[i]);

                            if (details.discussionStatuses[i].geoLocalization) {
                                var latitude = details.discussionStatuses[i].geoLocalization.split(',')[0].trim();
                                var longitude = details.discussionStatuses[i].geoLocalization.split(',')[1].trim();
                                details.discussionStatuses[i]['locationURL'] =
                                    'https://www.openstreetmap.org/?mlon='
                                    + longitude + '&mlat=' + latitude;
                            }
                        }

                        for (var i = 0; i < details.sharedByLogins.length; i++) {
                            details.sharedByLogins[i]['avatarURL'] = PathService.getAvatar(details.sharedByLogins[i]);
                        }

                        return details;
                    }
                },
                'update': {method: 'PATCH', cache: false, params: {statusId: '@statusId'}},
                'announce': {method: 'PATCH', cache: false, params: {params: '@statusId'}},
                'hideStatus': {
                    method: 'POST',
                    params: {statusId: '@statusId'},
                    cache: false,
                    url: '/tatami/rest/statuses/hide/:statusId'
                }
            });

    }
})();
