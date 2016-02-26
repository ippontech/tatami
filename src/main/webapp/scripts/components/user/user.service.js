'use strict';

tatamiJHipsterApp
    .factory('User', function ($resource) {
        return $resource('tatami/rest/users/:username', {}, {
                'query': {method: 'GET', isArray: true},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'save': { method:'POST' },
                'update': { method:'PUT' },
                'delete':{ method:'DELETE'}
            });
        });
