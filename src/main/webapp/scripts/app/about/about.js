'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('about', {
                parent: 'site',
                data: {
                    authorities: [],
                    pageTitle: 'login.title'
                },

                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('about');
                        return $translate.refresh();
                    }]
                }


            })
            .state('license', {
                parent: 'about' ,
                url: '/license',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/about/license/license.html',

                    }
                }
            })

            .state('presentation', {
                parent: 'about' ,
                url: '/presentation',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/about/presentation/presentation.html',


                    }
                }
            })

            .state('tos', {
                parent: 'about' ,
               url: '/tos',

                views: {
                    'content@': {
                        templateUrl: 'scripts/app/about/tos/tos.html',

                    }
                }
            })
    });
