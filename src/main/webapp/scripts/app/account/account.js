'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account', {
                abstract: true,
                parent: 'site',
                data: {
                    authorities: [],
                    pageTitle: 'login.title'
                },

                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            })

            .state('profile', {
                parent: 'account' ,
                url: '/profile',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/account/profile/profile.html',

                    }
                }
            })
    });
