'use strict';

tatamiJHipsterApp
    .factory('LogsService', function ($resource) {
        return $resource('tatami/logs', {}, {
            'findAll': { method: 'GET', isArray: true},
            'changeLevel': { method: 'PUT'}
        });
    });
