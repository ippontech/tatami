'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('create', {
                templateUrl: 'scripts/app/account/groups/groups.html',
                controller: 'GroupsCreateController',

                parent: 'groups',
                url: '/create',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })
    });
