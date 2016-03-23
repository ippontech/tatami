

tatamiJHipsterApp
    .factory('ProfileService', ['$resource', function ($resource) {
        return $resource('/tatami/rest/account/profile', null,
            {
                'get': {
                    method: 'GET'
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
