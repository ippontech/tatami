'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('search', {

                parent: 'list',
                url: '/search',
                views: {
                    'search': {
                        templateUrl: 'scripts/app/account/groups/list/search/search.html',
                        controller: 'GroupsListSearchController'
                    }
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                }
            })
    });
