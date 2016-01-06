TatamiApp.factory('UserSession', ['$q', '$window', 'ProfileService', 'localStorageService', function($q, $window, ProfileService, localStorageService) {
    var user;
    var authenticated = false;

    return {
        isAuthenticated: function() {
            return localStorageService.get('token') === "true";
        },

        isUserResolved: function() {
            return angular.isDefined(user);
        },

        setLoginState: function(loggedIn) {
            localStorageService.set('token', loggedIn);
        },

        clearSession: function() {
            localStorageService.clearAll();
        },

        getUser: function() {
            return user;
        },

        authenticate: function(force) {
            var deferred = $q.defer();

            if(force) {
                user = undefined;
            }

            if(this.isUserResolved() && user.action !== null) {
                deferred.resolve(user);
                return deferred.promise;
            }

            ProfileService.get(function(data) {
                // Success
                user = data;
                authenticated = true;
                deferred.resolve(user);
            }, function() {
                // Error
                user = null;
                authenticated = false;
                deferred.resolve(user);
            });

            return deferred.promise;
        }
    }
}]);
