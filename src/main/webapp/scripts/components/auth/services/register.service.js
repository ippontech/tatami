'use strict';

tatamiJHipsterApp
    .factory('Register', function ($resource) {
        return $resource('tatami/register', {}, {
        });
    });


