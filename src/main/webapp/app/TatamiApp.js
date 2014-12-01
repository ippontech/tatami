var TatamiApp = angular.module('TatamiApp', [ 
    'HomeModule',
    'AccountModule',
    'ngRoute',
    'ngResource',
    'pascalprecht.translate'
]);

TatamiApp.config(['$routeProvider', '$resourceProvider', '$locationProvider', 
    function($routeProvider, $resourceProvider, $locationProvider) {
    
    $routeProvider
        .when('/presentation', {
            templateUrl: 'app/components/about/PresentationView.html'
        })
        .when('/tos', {
            templateUrl: 'app/components/about/TermsView.html'
        })
        .when('/license', {
            templateUrl: 'app/components/about/LicenseView.html'
        })
        .otherwise({
            redirectTo: '/home/timeline' 
        });

    // Don't strip trailing slashes from REST URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;

    //$locationProvider.html5Mode(true);
}]);