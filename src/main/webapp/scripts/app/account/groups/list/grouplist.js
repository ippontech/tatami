'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('list', {
                templateUrl: 'scripts/app/account/groups/groups.html',
                controller: 'GroupsListController',

                parent: 'groups',
                url: '/list',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })
            .state('recommended', {
                templateUrl: 'scripts/app/account/groups/groups.html',
                controller: 'GroupsListController',

                parent: 'list',
                url: '/recommended',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })
            .state('mine', {
                templateUrl: 'scripts/app/account/groups/groups.html',
                controller: 'GroupsListController',

                parent: 'list',
                url: '/mine',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })
            .state('search', {
                templateUrl: 'scripts/app/account/groups/groups.html',
                controller: 'GroupsListController',

                parent: 'list',
                url: '/search',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })

    });
