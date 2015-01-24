TatamiApp.factory('AuthenticationService', ['$rootScope', '$state', '$window', 'UserSession', function($rootScope, $state, $window, UserSession) {
    return {
        authenticate: function() {
            return UserSession.authenticate().then(function(result) {
                $window.sessionStorage["userInfo"] = JSON.stringify(result);
            });
        }
    }
}])