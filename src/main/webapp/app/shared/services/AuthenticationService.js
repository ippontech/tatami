TatamiApp.factory('AuthenticationService', ['$rootScope', '$state', 'UserSession', function($rootScope, $state, UserSession) {
    return {
        authenticate: function() {
            return UserSession.authenticate().then(function(result) {
                if(result.action === null && !$state.current.data.public) {
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