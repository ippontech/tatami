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

            console.log('getting user profile');
            ProfileService.get(function(data) {
                console.log('success');
                // Success
                user = data;
                authenticated = true;
                deferred.resolve(user);
            }, function() {
                console.log('failed');
                // Error
                user = null;
                authenticated = false;
                deferred.resolve(user);
            });

            return deferred.promise;
        }
    }
}]);
