(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('ProfileService', profileService);

    profileService.$inject = ['$resource', 'PathService'];

    function profileService($resource, PathService) {
        return $resource(PathService.buildPath('/tatami/rest/account/profile'), null,
            {
                'get': {
                    method: 'GET',
                    transformResponse: function (profile) {
                        profile = angular.fromJson(profile);
                        profile['avatarURL'] = PathService.getAvatar(profile);
                        return profile;
                    }
                },
                'update': {
                    method: 'PUT',
                    transformRequest: function (profile) {
                        delete profile['avatarURL'];
                        return angular.toJson(profile);
                    }
                }
            });
    }
})();
