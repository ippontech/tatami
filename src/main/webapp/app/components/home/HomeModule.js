var HomeModule = angular.module('HomeModule', ['StatusModule', 'SidebarModule', 'TimelineModule', 'ngRoute']);

HomeModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'app/components/home/TimelineView.html'
        })
        .when('/home/timeline', {
            templateUrl: 'app/components/home/TimelineView.html'
        });
}]);