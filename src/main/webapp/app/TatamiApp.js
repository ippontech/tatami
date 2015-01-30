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
    'ngToast', // This may be better suited in the account module, not sure if home has any need for ngToast
    'LocalStorageModule'
]);

TatamiApp.run([ '$rootScope', '$state', '$stateParams', 'AuthenticationService', 'UserSession', function($rootScope, $state, $stateParams, AuthenticationService, UserSession) {
    // When the app is started, determine if the user is authenticated, if so, send them to home timeline
    if(UserSession.isAuthenticated()) {
        $state.go('tatami.home.home.timeline');
    }
    // Otherwise have them login
    else {
        $state.go('tatami.login.main');
    }

    // Make state information available to $rootScope, and thus $scope in our controllers
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        // If the user is logged in, we allow them to go where they intend to
        if(UserSession.isAuthenticated()) {
            return;
        }
/*
        // All users can access the login page
        if(toState.name === 'tatami.login.main') {
            return;
        }
        */
        if(toState.data.public) {
            return;
        }

        // The user is not logged in, and trying to access a state that requires them to be logged in
        // Stash the state they tried to access
        $rootScope.returnToState = toState;
        $rootScope.returnToParams = toStateParams;
        // Go to login page
        event.preventDefault();
        $state.go('tatami.login.main');
    })
}]);

TatamiApp.config(['$resourceProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider',
    function($resourceProvider, $locationProvider, $urlRouterProvider, $stateProvider) {

        //$urlRouterProvider.otherwise('/home/timeline');
        //$urlRouterProvider.otherwise('/home/timeline');

        // Don't strip trailing slashes from REST URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
            .state('tatami', {
                url: '',
                abstract: true,
                templateUrl: 'index.html',
                resolve: {
                    authorize: ['AuthenticationService', function(AuthenticationService) {
                        AuthenticationService.authenticate();
                    }]
                },
                data: {
                    public: false
                }
            });

        //$locationProvider.html5Mode(true);
}]);