

tatamiJHipsterApp
    .factory('ProfileService', ['$resource', function ($resource) {
        return $resource('/tatami/rest/account/profile', null,
            {
                'get': {
                    method: 'GET',
                    transformResponse: function (profile) {
                        var parsedProfile = {};
                        try {
                            parsedProfile = angular.fromJson(profile);
                        } catch(e) {
                            parsedProfile = {};
                        }
                        parsedProfile['avatarURL'] = parsedProfile.avatar ==='' ? '/assets/images/default_image_profile.png' : '/tatami/avatar/' + parsedProfile.avatar + '/photo.jpg';
                        return parsedProfile;
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
    }]);
