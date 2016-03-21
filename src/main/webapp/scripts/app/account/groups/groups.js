'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.groups', {
                parent: 'account',
                url: '/groups',
                templateUrl: 'scripts/app/account/groups/groups.html',
                controller: 'GroupsController',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }

            })
    });
