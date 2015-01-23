var TatamiApp = angular.module('TatamiApp', [
    'TopMenuModule',
    'LoginModule',
    'HomeModule',
    'AccountModule',
    'AboutModule',
    'AdminModule',
    'ngResource',
    'pascalprecht.translate',
    'ui.router',
    'ngToast' // This may be better suited in the account module, not sure if home has any need for ngToast
]);

TatamiApp.run([ '$rootScope', '$state', '$stateParams', 'AuthenticationService', 'UserSession', function($rootScope, $state, $stateParams, AuthenticationService, UserSession) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.firstPass = true;

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        /*
        if(!UserSession.isAuthenticated() && $rootScope.firstPass) {
            // Stash where the user wants to go
            $rootScope.returnToState = toState.name === 'tatami.login.main' ? undefined : toState;
            $rootScope.returnToStateParams = toParams;
            $rootScope.firstPass = false;

            event.preventDefault();
            $state.go('tatami.login.main');
        }*/
        if(UserSession.isUserResolved()) {
            return;
        }

        if(toState.name === 'tatami.login.main') {
            console.log('here, returning');
            return;
        }
        AuthenticationService.authenticate();
    })
}]);

TatamiApp.config(['$resourceProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider',
    function($resourceProvider, $locationProvider, $urlRouterProvider, $stateProvider) {

        $urlRouterProvider.otherwise('/login');
        //$urlRouterProvider.otherwise('/home/timeline');

        // Don't strip trailing slashes from REST URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
            .state('tatami', {
                url: '',
                abstract: true,
                templateUrl: 'index.html'
            });

        //$locationProvider.html5Mode(true);
}]);