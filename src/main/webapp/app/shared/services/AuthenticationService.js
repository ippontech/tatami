TatamiApp.factory('AuthenticationService', ['$rootScope', '$state', 'UserSession', 'localStorageService', function($rootScope, $state, UserSession) {
    return {
        authenticate: function() {
            return UserSession.authenticate().then(function(result) {
                if(result.action === null && $state.current.data && !$state.current.data.public) {
                    // User isn't login in. Change the session token, and redirect to login
                    UserSession.clearSession();
                    $state.go('tatami.login.main');
                }
                if(result.username !== null && !UserSession.isAuthenticated()) {
                    UserSession.setLoginState(true);
                }
            });
        }
    }
}]);