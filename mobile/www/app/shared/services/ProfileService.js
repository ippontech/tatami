(function() {
    'use strict';

    angular.module('tatami.services', [])
        .factory('ProfileService', profileService);

    profileService.$inject = ['$resource', 'TatamiEndpoint'];

    function profileService($resource, TatamiEndpoint) {
        return $resource(TatamiEndpoint.url  + '/tatami/rest/account/profile', null,
            {
                'get': {
                    method: 'GET',
                    transformResponse: function (profile) {
                        profile = angular.fromJson(profile);
                        profile['avatarURL'] = profile.avatar === '' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + profile.avatar + '/photo.jpg';
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
