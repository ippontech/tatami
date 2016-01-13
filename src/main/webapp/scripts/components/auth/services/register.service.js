'use strict';

angular.module('tatamiJHipsterApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


