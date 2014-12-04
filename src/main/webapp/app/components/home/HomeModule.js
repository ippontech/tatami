var HomeModule = angular.module('HomeModule', ['PostModule', 'HomeSidebarModule', 'ProfileSidebarModule', 'TimelineModule', 'ui.router']);

HomeModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('timeline', {
            url: '/home/timeline',
            templateUrl: 'app/components/home/timeline/TimelineView.html'
        })
        .state('profile', {
            url: '/home/profile/:username',
            templateUrl: 'app/components/home/profile/ProfileView.html'
        });
}]);