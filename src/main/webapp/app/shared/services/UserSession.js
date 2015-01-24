TatamiApp.factory('UserSession', ['$q', '$window', 'ProfileService', function($q, $window, ProfileService) {
    var user;
    var authenticated;

    return {
        isAuthenticated: function() {
            return $window.sessionStorage["authorized"] === "true";
        },

        isUserResolved: function() {
            return user != null;
        },

        setLoginState: function(loggedIn) {
            $window.sessionStorage["authorized"] = loggedIn;
        },

        getUser: function() {
            return user;
        },

        authenticate: function(force) {
            var deferred = $q.defer();

            if(force) {
                user = undefined;
            }

            if(angular.isDefined(user)) {
                deferred.resolve(user);

                return deferred.promise;
            }

            ProfileService.get(function(data) {
                // Success
                user = data;
                authenticated = true;
                deferred.resolve(user);
            }, function(data) {
                // Error
                user = null;
                authenticated = false;
                deferred.resolve(user);
            });

            return deferred.promise;
        }
    }
}]);