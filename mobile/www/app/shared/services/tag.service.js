(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('TagService', tagService);

    tagService.$inject = ['$resource', 'PathService'];
    function tagService($resource, PathService) {
        return $resource(PathService.buildPath('/tatami/rest/tags'), null,
            {
                'get': { method:'GET', params: { tag: '@tag' }, url: PathService.buildPath('/tatami/rest/tags/:tag') },
                'getTagTimeline': {
                    method:'GET', isArray: true, params: { tag: '@tag' }, url: PathService.buildPath('/tatami/rest/tags/:tag/tag_timeline'),
                    transformResponse: function(statuses) {
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
                },
                'follow': { method:'PUT', params: { tag: '@tag' }, url: PathService.buildPath('/tatami/rest/tags/:tag') },
                'getPopular': { method: 'GET', isArray: true, url: PathService.buildPath('/tatami/rest/tags/popular') }
            });
    }
})();
