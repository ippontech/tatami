(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('HomeService', homeService);

    homeService.$inject = ['$resource', 'PathService'];
    function homeService($resource, PathService) {
        return $resource(null, null,
            {
                'getMentions': {
                    method: 'GET', isArray: true, url: PathService.buildPath('/tatami/rest/mentions'),
                    transformResponse: responseTransform
                },
                'getFavorites': {
                    method: 'GET', isArray: true, url: PathService.buildPath('/tatami/rest/favorites'),
                    transformResponse: responseTransform
                },
                'getCompanyTimeline': {
                    method: 'GET', isArray: true, url: PathService.buildPath('/tatami/rest/company'),
                    transformResponse: responseTransform
                }
            });

        responseTransform.$inject = ['statuses'];
        function responseTransform(statuses) {
            statuses = angular.fromJson(statuses);

            for(var i = 0; i < statuses.length; i++) {
                statuses[i]['avatarURL'] = PathService.getAvatar(statuses[i]);

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
    }
})();
