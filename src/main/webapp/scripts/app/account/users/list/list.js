'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('listusers', {
                templateUrl: 'scripts/app/account/users/users.html',
                parent: 'users',
                url: '/list',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })

    });
