var TatamiApp = angular.module('TatamiApp', [
    'TopMenuModule',
    'LoginModule',
    'HomeModule',
    'AccountModule',
    'AboutModule',
    'AdminModule',
    'ngResource',
    'ngCookies',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    'ngToast', // This may be better suited in the account module, not sure if home has any need for ngToast
    'mentio',
    'LocalStorageModule',
    'bm.bsTour',
    'ngTouch'
]);

TatamiApp.run([ '$rootScope', '$state', '$stateParams', 'AuthenticationService', 'UserSession', 'localStorageService', function($rootScope, $state, $stateParams, AuthenticationService, UserSession, localStorageService) {
    // Make state information available to $rootScope, and thus $scope in our controllers
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // When the app is started, determine if the user is authenticated, if so, send them to home timeline
    UserSession.authenticate().then(function(result) {
        if(result !== null) {
            // We aren't logged in, clear the old session, and send the user to the login page
            if(result.action === null) {
                if(angular.isDefined($state.current.data) && !$state.current.data.public) {
                    UserSession.clearSession();
                    $state.go('tatami.login.main');
                }
                // If we are trying to access a state that is public, allow user
                if(angular.isDefined($rootScope.destinationState)) {
                    $state.go($rootScope.destinationState, $rootScope.destinationParams);
                }
                else {
                    // The destination state is undefined -- This is the first time accessing the site
                    UserSession.clearSession();
                    $state.go('tatami.login.main');
                }

            }

            // We are logged in, but the session hasn't been set, so we set it
            if(angular.isDefined(result.username)) {
                if(!UserSession.isAuthenticated()) {
                    UserSession.setLoginState(true);
                }
                // If there is no destination state, send user to timeline, since they are logged in
                if(!angular.isDefined($rootScope.destinationState)) {
                    $state.go('tatami.home.home.timeline');
                }
            }
        }
        else {
            $state.go('tatami.login.main');
        }
    });

    $rootScope.$on('$stateChangeError', function(event) {
        event.preventDefault();
        $state.transitionTo('tatami.pageNotFound', null, { location: false })
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        $rootScope.destinationState = toState;
        $rootScope.destinationParams = toStateParams;

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
    });
}]);


TatamiApp.config(['$resourceProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider',
    function($resourceProvider, $locationProvider, $urlRouterProvider, $stateProvider) {

        // Don't strip trailing slashes from REST URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
            .state('tatami', {
                url: '',
                abstract: true,
                views: {
                    'topMenu@': {
                        templateUrl: 'app/shared/topMenu/TopMenuView.html',
                        controller: 'TopMenuController'
                    },
                    '': {
                        templateUrl: 'index.html'
                    }
                },
                resolve: {
                    authorize: ['AuthenticationService', function(AuthenticationService) {
                        return AuthenticationService.authenticate();
                    }]
                },
                data: {
                    public: false,
                    roles: ["ROLE_USER"]
                }
            })
            .state('tatami.pageNotFound', {
                templateUrl: 'app/shared/error/404View.html',
                data: {
                    public: true
                }
            })
            .state('tatami.accessdenied', {
                templateUrl: 'app/shared/error/500View.html',
                data: {
                    public: true
                }
            });

        //$locationProvider.html5Mode(true);
}]);