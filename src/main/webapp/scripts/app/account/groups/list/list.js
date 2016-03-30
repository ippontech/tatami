'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('list', {


                parent: 'groups',
                url: '/list',

                templateUrl: 'scripts/app/account/groups/groups.html',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })
    });
