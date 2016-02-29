

tatamiJHipsterApp
    .factory('ProfileService', ['$resource', function ($resource) {
        console.log("in ProfileService");
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
                        parsedProfile['avatarURL'] = parsedProfile.avatar === '/tatami/avatar/' + parsedProfile.avatar + '/photo.jpg';
                        if (typeof parsedProfile.avatar == 'undefined') {
                            parsedProfile['avatarURL'] = '/assets/images/default_image_profile.png';
                        }
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
