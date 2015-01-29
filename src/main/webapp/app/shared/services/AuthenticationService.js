TatamiApp.factory('AuthenticationService', ['$rootScope', '$state', '$window', 'UserSession', function($rootScope, $state, $window, UserSession) {
    return {
        authenticate: function() {
            return UserSession.authenticate().then(function(result) {
                if(result.action === null) {
                    // User isn't login in. Change the session token, and redirect to login
                    //console.log('going to login page');
                    UserSession.setLoginState(false);
                    $state.go('tatami.login.main');
                }
                return;
            });
        }
    }
}]);