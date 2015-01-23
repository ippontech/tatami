TatamiApp.factory('AuthenticationService', ['$rootScope', '$state', '$window', 'UserSession', function($rootScope, $state, $window, UserSession) {
    return {
        authenticate: function() {
            return UserSession.authenticate().then(function(result) {
                $window.sessionStorage["userInfo"] = JSON.stringify(result);
                $rootScope.userResolved = UserSession.isUserResolved();
                $rootScope.returnToState = $state.toState;
                $rootScope.returnToParams = $state.toParams;

                $state.go('tatami.login.main');
            });
        }
    }
}])