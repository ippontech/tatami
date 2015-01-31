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

TatamiApp.run([ '$rootScope', '$state', '$stateParams', 'AuthenticationService', 'UserSession', 'localStorageService', function($rootScope, $state, $stateParams, AuthenticationService, UserSession, localStorageService) {
    // When the app is started, determine if the user is authenticated, if so, send them to home timeline
    UserSession.authenticate().then(function(result) {
        if(result.action === null) {
            UserSession.clearSession();
        }
    });
    if(UserSession.isAuthenticated()) {
        $state.go('tatami.home.home.timeline');
    }
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

        if(toState.data && toState.data.public) {
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
        //$locationProvider.html5Mode(true);

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
            })
            .state('tatami.accessdenied', {
                url: '/accessdenied',
                templateUrl: 'app/shared/error/500View.html',
                data: {
                    public: true
                }
            });

        //$locationProvider.html5Mode(true);
}]);