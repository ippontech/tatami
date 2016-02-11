'use strict';

angular.module('tatamiJHipsterApp')
    .factory('Activate', function ($resource) {
        return $resource('tatami/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    });


