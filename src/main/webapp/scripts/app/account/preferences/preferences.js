'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.preferences', {
                parent: 'account',
                url: '/preferences',
                templateUrl: 'scripts/app/account/preferences/preferences.html',
                controller: 'PreferencesController'
            })
    });
