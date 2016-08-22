'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.password', {
                templateUrl: 'scripts/app/account/password/password.html',
                controller: 'ChangePasswordController',
                parent: 'account',
                url: '/password',
                data: {
                    authorities: ['ROLE_USER']
                },

                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('password');
                        return $translate.refresh();
                    }]
                }
            });
    });
