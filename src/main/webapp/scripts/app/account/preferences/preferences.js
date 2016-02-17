'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('preferences', {
                parent: 'account',
                url: '/preferences',
                templateUrl: 'scripts/app/account/preferences/preferences.html',
                controller: 'PreferencesController'
            })
    });
