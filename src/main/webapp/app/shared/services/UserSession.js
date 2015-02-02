TatamiApp.factory('UserSession', ['$q', '$window', 'ProfileService', 'localStorageService', function($q, $window, ProfileService, localStorageService) {
    var user;
    var authenticated = false;

    return {
        isAuthenticated: function() {
            return localStorageService.get('token') === "true";
        },

        isUserResolved: function() {
            return user != null;
        },

        setLoginState: function(loggedIn) {
            localStorageService.set('token', loggedIn);
            // console.log(localStorageService.get('token'));
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