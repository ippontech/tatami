tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('users', {
                abstract: true,
                template: '<ui-view></ui-view>',
                controller: 'UsersController',

                parent: 'account',
                url: '/users',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.users'
                }
            })

    });
