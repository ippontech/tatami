TatamiApp.factory('UserSession', function() {
    var email = undefined;
    var authenticated = false;
    return {
        setAuthStatus: function(authStatus, user) {
            email = user;
            authenticated = authStatus;
        },

        isAuthenticated: function() {
            return authenticated;
        }
    }
});