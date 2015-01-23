TatamiApp.factory('UserSession', ['$q', '$window', 'ProfileService', function($q, $window, ProfileService) {
    var user = JSON.parse($window.sessionStorage["userInfo"]);
    var authenticated;

    return {
        isAuthenticated: function() {
            return authenticated;
        },

        isUserResolved: function() {
            return angular.isDefined(user);
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