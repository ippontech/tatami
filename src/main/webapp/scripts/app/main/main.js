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

        .state('profile', {
            parent: 'account',
            url: '/profile',

            templateUrl: 'scripts/app/account/profile/profile.html',
            resolve: {
                Username: ['profileInfo', function(profileInfo) {
                    return profileInfo.data;
                }]
            },
            controller: 'ProfileController'

        })
    });
