var HomeModule = angular.module('HomeModule', ['PostModule', 'SidebarModule', 'TimelineModule', 'ngRoute', 'ui.router']);

HomeModule.config(['$routeProvider', '$stateProvider', '$urlRouterProvider', function($routeProvider, $stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('timeline', {
            url: '/home/timeline',
            templateUrl: 'app/components/home/TimelineView.html'
        });
}]);