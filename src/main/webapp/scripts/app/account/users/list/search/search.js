'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('searchusers', {

                parent: 'listusers',
                url: '/search',
                views: {
                    'list': {
                        templateUrl: 'scripts/app/account/users/list/search/search.html',
                        controller: 'UsersSearchController'
                    }
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.users'
                }
            })
    });
