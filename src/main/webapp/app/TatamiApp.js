var TatamiApp = angular.module('TatamiApp', [
    'TopMenuModule',
    'LoginModule',
    'HomeModule',
    'AccountModule',
    'AboutModule',
    'AdminModule',
    'FooterModule',
    'ngResource',
    'ngTouch',
    'ngCookies',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    'mentio',
    'LocalStorageModule',
    'bm.bsTour'
]);

TatamiApp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        if($state.includes('tatami.home') && toState !== fromState) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    });
}]);

TatamiApp.run(['$rootScope', '$state', '$stateParams', 'AuthenticationService', 'UserSession', function($rootScope, $state, $stateParams, AuthenticationService, UserSession) {
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
        $state.transitionTo('tatami.login.main', null, { location: false });
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
                        templateUrl: 'app/shared/topMenu/TopMenuView.min.html',
                        controller: 'TopMenuController'
                    },
                    '': {
                        templateUrl: 'index.html'
                    },
                    'footer@': {
                        templateUrl: 'app/shared/footer/FooterView.min.html',
                        controller: 'FooterController'
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
                templateUrl: 'app/shared/error/404View.min.html',
                data: {
                    public: true
                }
            })
            .state('tatami.accessdenied', {
                templateUrl: 'app/shared/error/500View.min.html',
                data: {
                    public: true
                }
            });
}]);