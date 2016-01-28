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
                url: '/account',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/account/account.html',

                    }
                },





                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            })


    });
