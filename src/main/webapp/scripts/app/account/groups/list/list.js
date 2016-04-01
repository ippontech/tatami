'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('list', {
                templateUrl: 'scripts/app/account/groups/groups.html',


                parent: 'groups',
                url: '/list',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })


    });
