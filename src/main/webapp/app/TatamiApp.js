var TatamiApp = angular.module('TatamiApp', [
    'TopMenuModule',
    'LoginModule',
    'HomeModule',
    'AccountModule',
    'AboutModule',
    'ngResource',
    'pascalprecht.translate',
    'ui.router',
    'ngToast' // This may be better suited in the account module, not sure if home has any need for ngToast
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