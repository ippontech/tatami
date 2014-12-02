var TatamiApp = angular.module('TatamiApp', [ 
    'HomeModule',
    'AccountModule',
    'ngResource',
    'pascalprecht.translate',
    'ui.router'
]);

TatamiApp.config(['$resourceProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider',
    function($resourceProvider, $locationProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/home/timeline");

    $stateProvider
        .state('presentation', {
            url: '/presentation',
            templateUrl: 'app/components/about/PresentationView.html'
        })
        .state('tos', {
            url: '/tos',
            templateUrl: 'app/components/about/TermsView.html'
        })
        .state('license', {
            url: '/license',
            templateUrl: 'app/components/about/LicenseView.html'
        });

    // Don't strip trailing slashes from REST URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;

    //$locationProvider.html5Mode(true);
}]);