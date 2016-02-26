'use strict';

tatamiJHipsterApp
    .factory('Activate', function ($resource) {
        return $resource('tatami/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    });


