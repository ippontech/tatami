'use strict';

tatamiJHipsterApp
    .factory('AccountService', function AccountService($resource) {
        return $resource('/tatami/rest/account/profile', {}, {
            'get': {
                method: 'GET',
                transformResponse: function (profile) {
                 var parsedProfile = {};
                 try {
                     parsedProfile = angular.fromJson(profile);
                 } catch(e) {
                     parsedProfile = {};
                 }
                 parsedProfile['avatarURL'] = !parsedProfile.avatar ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + parsedProfile.avatar + '/photo.jpg';
                 return parsedProfile;
                },
                params: {},
                isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            },
                'update': {
                 method: 'POST',
                 transformRequest: function (profile) {
                     delete profile['avatarURL'];
                     return angular.toJson(profile);
                 }
            }
        });
    });
