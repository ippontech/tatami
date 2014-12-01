var HomeModule = angular.module('HomeModule', ['PostModule', 'SidebarModule', 'TimelineModule', 'ngRoute']);

HomeModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home/timeline', {
            templateUrl: 'app/components/home/TimelineView.html'
        });
}]);