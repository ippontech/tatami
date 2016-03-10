tatamiJHipsterApp
    .factory('PreferencesService', ['$resource', function ($resource) {
        return $resource('/tatami/rest/account/preferences', null,
            {
                'get': {
                    method: 'GET',
                    transformResponse: function (preferences) {
                        return angular.fromJson(preferences);
                    }
                },
                'update': {
                    method: 'POST',
                    transformRequest: function (preferences) {
                        return angular.toJson(preferences);
                    }
                }
            });
    }]);
