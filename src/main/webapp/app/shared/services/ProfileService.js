TatamiApp.factory('ProfileService', ['$resource', function($resource) {
    return $resource('/tatami/rest/account/profile', null,
    {
        'get': { 
            method: 'GET',
            transformResponse: function(profile, headersGetter) {
                profile = angular.fromJson(profile);
                profile['avatarURL'] = profile.avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + profile.avatar + '/photo.jpg';
                return profile;
            }
        },
        'update' : { 
            method: 'PUT',
            transformRequest: function(profile, headersGetter) {
                delete profile['avatarURL'];
                return angular.toJson(profile);
            }
        }
    });
}]);