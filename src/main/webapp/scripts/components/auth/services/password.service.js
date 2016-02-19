'use strict';

angular.module('tatamiJHipsterApp')
    .factory('Password', function ($resource) {
        return $resource('tatami/rest/account/change_password', {}, {
        });
    });

angular.module('tatamiJHipsterApp')
    .factory('PasswordResetInit', function ($resource) {
        return $resource('tatami/rest/account/reset_password/init', {}, {
        })
    });

angular.module('tatamiJHipsterApp')
    .factory('PasswordResetFinish', function ($resource) {
        return $resource('tatami/rest/account/reset_password/finish', {}, {
        })
    });

angular.module('tatamiJHipsterApp')
    .factory('PasswordService', function ($resource) {
        return $resource('tatami/rest/account/password', {}, {
        })
    });

