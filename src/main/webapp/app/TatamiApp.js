var TatamiApp = angular.module('TatamiApp', [
    'LoginModule',
    'HomeModule',
    'AccountModule',
    'AboutModule',
    'ngResource',
    'pascalprecht.translate',
    'ui.router'
]);

TatamiApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

TatamiApp.config(['$resourceProvider', '$locationProvider', '$urlRouterProvider',
    function($resourceProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');
        //$urlRouterProvider.otherwise('/home/timeline');

        // Don't strip trailing slashes from REST URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        //$locationProvider.html5Mode(true);
}]);