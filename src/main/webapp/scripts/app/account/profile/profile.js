'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.profile', {
                parent: 'account',
                url: '/profile',

                templateUrl: 'scripts/app/account/profile/profile.html',
                controller: 'ProfileController'

            })

    });
