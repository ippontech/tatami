var HomeModule = angular.module('HomeModule', ['PostModule', 'HomeSidebarModule', 'ProfileSidebarModule', 'TimelineModule', 'ui.router']);

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
                'homeBody': {
                    templateUrl: 'app/components/home/timeline/TimelineView.html'
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
                'homeBody': {
                    templateUrl: 'app/components/home/profile/ProfileView.html'
                }
            }
        });
}]);