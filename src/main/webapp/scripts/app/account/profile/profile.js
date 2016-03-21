'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.profile', {
                parent: 'account',
                url: '/profile',

                templateUrl: 'scripts/app/account/groups/groups.html',
                resolve: {
                    userLogin: ['profileInfo', function(profileInfo) {
                            return profileInfo.data;
                    }]
                },
                controller: 'ProfileController'

            })

    });
