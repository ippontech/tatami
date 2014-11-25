var TatamiApp = angular.module('TatamiApp', [ 
    'HomeModule',
    'ngRoute',
    'ngResource',
    'pascalprecht.translate'
]);

/*
    'StatusModule', 
    'PreferenceModule',
    'AccountModule', 
    'PasswordModule', 
    'GroupModule',
    'ProfileModule', 
    'TagModule'
*/

TatamiApp.config(['$resourceProvider', '$routeProvider', '$locationProvider', 
    function($resourceProvider, $routeProvider, $locationProvider) {
    
    // Don't strip trailing slashes from REST URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $routeProvider
        .when('/', {
            templateUrl: 'app/components/home/TimelineView.html'
        });

    $locationProvider.html5Mode(true);
}]);