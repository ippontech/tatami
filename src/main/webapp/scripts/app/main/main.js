'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider


            .state('home', {
                //   abstract: true,
                parent: 'site',
                url: '/',
                data: {
                    authorities: [],
                    pageTitle: 'login.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/login/login.html',
                        controller: 'LoginController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
    });
