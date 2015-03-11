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
    'ui.bootstrap',
    'ngToast', // This may be better suited in the account module, not sure if home has any need for ngToast
    'LocalStorageModule'
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
                UserSession.clearSession();
                $state.go('tatami.login.main');
            }
            // We are logged in, but the session hasn't been set, so we set it
            if(angular.isDefined(result.username) && !UserSession.isAuthenticated()) {
                UserSession.setLoginState(true);
            }
        }
        else {
            $state.go('tatami.login.main');
        }

        // User is logged in
        if(UserSession.isAuthenticated()) {
            // State being accesses was not the timeline
            if(angular.isDefined($rootScope.returnToState)) {
                $state.go($rootScope.returnToState, $rootScope.returnToParams);
            }
            else if(angular.isDefined($rootScope.destinationState)) {
                //$state.go($rootScope.destinationState, $rootScope.destinationParams);
            }
            else {
                $state.go('tatami.home.home.timeline');
            }
        }
    });
/*
    $rootScope.$on('$stateChangeError', function(event) {
        event.preventDefault();
        $state.transitionTo('tatami.pageNotFound', null, { location: false })
    });*/

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

        //$urlRouterProvider.otherwise('/home/timeline');
        //$urlRouterProvider.otherwise('/home/timeline');
        //$locationProvider.html5Mode(true);

        // Don't strip trailing slashes from REST URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
            .state('tatami', {
                url: '',
                abstract: true,
                views: {
                    'topMenu@': {
                        templateUrl: 'app/shared/topMenu/TopMenuView.html',
                        controller: 'TopMenuController',
                    },
                    '': {
                        templateUrl: 'index.html'
                    }
                },
                resolve: {
                    authorize: ['AuthenticationService', function(AuthenticationService) {
                        AuthenticationService.authenticate();
                    }]
                },
                data: {
                    public: false,
                    roles: ["ROLE_USER"],
                }
            })
            .state('tatami.accessdenied', {
                templateUrl: 'app/shared/error/500View.html',
                data: {
                    public: true
                }
            })
            .state('tatami.pageNotFound', {
                templateUrl: 'app/shared/error/404View.html',
                data: {
                    public: true
                }
            });

        //$locationProvider.html5Mode(true);
}]);