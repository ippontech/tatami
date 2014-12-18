var TatamiApp = angular.module('TatamiApp', [ 
    'HomeModule',
    'AccountModule',
    'AboutModule',
    'ngResource',
    'pascalprecht.translate',
    'ui.router'
]);

TatamiApp.config(['$resourceProvider', '$locationProvider', '$urlRouterProvider',
    function($resourceProvider, $locationProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home/timeline');

    // Don't strip trailing slashes from REST URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;

    //$locationProvider.html5Mode(true);
}]);