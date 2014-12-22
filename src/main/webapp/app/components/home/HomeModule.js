var HomeModule = angular.module('HomeModule', ['PostModule', 'HomeSidebarModule', 'ProfileSidebarModule', 'ngSanitize', 'angularMoment', 'ui.router']);

HomeModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home',{
            url: '/home',
            abstract: true,
            templateUrl: 'app/components/home/HomeView.html',
            controller: 'HomeController'
        })
        .state('home.timeline', {
            url: '/timeline',
            views: {
                'homeSide': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent': {
                    templateUrl: 'app/shared/homeContent/HomeContentView.html'
                }
            }
        })
        .state('home.mentions', {
            url: '/mentions',
            views: {
                'homeSide': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent': {
                    templateUrl: 'app/shared/homeContent/HomeContentView.html'
                }
            }
        })
        .state('home.favorites', {
            url: '/favorites',
            views: {
                'homeSide': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent': {
                    templateUrl: 'app/shared/homeContent/HomeContentView.html'
                }
            }
        })
        .state('home.profile', {
            url: '/profile/:username',
            views: {
                'homeSide': {
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader': {
                    templateUrl: ''
                },
                'homeBodyContent': {
                    templateUrl: ''
                }
            }
        });
    }
]);