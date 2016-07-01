'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('account', {

                abstract: true,
                parent: 'site',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'account.title'
                },
                url: '/account',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/account/account.html',
                        controller: 'AccountController'
                    }

                },

                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account');
                        $translatePartialLoader.addPart('form');
                        return $translate.refresh();
                    }],
                    profileInfo: ['AccountService', function(AccountService) {
                        return AccountService.get().$promise;
                    }],

                }

            })




    });
