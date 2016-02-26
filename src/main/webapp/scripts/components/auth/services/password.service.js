'use strict';

tatamiJHipsterApp
    .factory('Password', function ($resource) {
        return $resource('tatami/rest/account/change_password', {}, {
        });
    });

tatamiJHipsterApp
    .factory('PasswordResetInit', function ($resource) {
        return $resource('tatami/rest/account/reset_password/init', {}, {
        })
    });

tatamiJHipsterApp
    .factory('PasswordResetFinish', function ($resource) {
        return $resource('tatami/rest/account/reset_password/finish', {}, {
        })
    });

tatamiJHipsterApp
    .factory('PasswordService', function ($resource) {
        return $resource('tatami/rest/account/password', {}, {
        })
    });

