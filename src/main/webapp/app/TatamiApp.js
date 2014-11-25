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
    'GroupsModule',
    'ProfileModule', 
    'TagModule'
*/

TatamiApp.config(['$routeProvider', '$resourceProvider', '$locationProvider', 
    function($routeProvider, $resourceProvider, $locationProvider) {
    
    $routeProvider
        .otherwise({ 
            redirectTo: '/home' 
        });

    // Don't strip trailing slashes from REST URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;

    //$locationProvider.html5Mode(true);
}]);