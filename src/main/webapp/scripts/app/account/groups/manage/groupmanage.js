'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('manage', {
                templateUrl: 'scripts/app/account/groups/groups.html',
                controller: 'GroupsManageController',

                parent: 'groups',
                url: '/manage',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })
    });
