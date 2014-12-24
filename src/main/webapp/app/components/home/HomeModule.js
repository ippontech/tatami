var HomeModule = angular.module('HomeModule', ['PostModule', 'HomeSidebarModule', 'ProfileSidebarModule', 'ngSanitize', 'angularMoment', 'ui.router']);

HomeModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home',{
            url: '/home',
            abstract: true,
            templateUrl: 'app/components/home/HomeView.html'
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
                    templateUrl: 'app/shared/homeContent/HomeContentView.html',
                    controller: 'HomeController'
                }
            },
            resolve: {
                TimelineService: 'TimelineService',
                statuses: function(TimelineService) {
                    return TimelineService.getTimeline().$promise;
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
                    templateUrl: 'app/shared/homeContent/HomeContentView.html',
                    controller: 'HomeController'
                }
            },
            resolve: {
                TimelineService: 'TimelineService',
                statuses: function(TimelineService) {
                    return TimelineService.getMentions().$promise;
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
                    templateUrl: 'app/shared/homeContent/HomeContentView.html',
                    controller: 'HomeController'
                }
            },
            resolve: {
                TimelineService: 'TimelineService',
                statuses: function(TimelineService) {
                    return TimelineService.getFavorites().$promise;
                }
            }
        })
        .state('home.company', {
            url: '/company',
            views: {
                'homeSide': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent': {
                    templateUrl: 'app/shared/homeContent/HomeContentView.html',
                    controller: 'HomeController'
                }
            },
            resolve: {
                TimelineService: 'TimelineService',
                statuses: function(TimelineService) {
                    return TimelineService.getCompanyWall().$promise;
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
        })
        .state('home.tag', {
            url: '/tag/:tag',
            views: {
                'homeSide': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader': {
                    templateUrl: 'app/components/home/tag/TagHeaderView.html',
                    controller: 'TagHeaderController'
                },
                'homeBodyContent': {
                    templateUrl: 'app/shared/homeContent/HomeContentView.html',
                    controller: 'HomeController'
                }
            },
            resolve: {
                TagService: 'TagService',
                tag: function(TagService, $stateParams) {
                    return TagService.get({ tag: $stateParams.tag }).$promise;
                },
                statuses: function(TagService, $stateParams) {
                    return TagService.getTagTimeline({ tag: $stateParams.tag }).$promise;
                }
            }
        });
    }
]);