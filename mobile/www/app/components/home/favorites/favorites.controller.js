(function() {
    'use strict';

    angular.module('tatami')
        .controller('FavoritesCtrl', favoritesCtrl);

    favoritesCtrl.$inject = ['favorites', 'currentUser', 'TatamiStatusRefresherService', '$q'];
    function favoritesCtrl(favorites, currentUser, TatamiStatusRefresherService, $q) {
        var vm = this;
        vm.favorites = favorites;
        vm.currentUser = currentUser;
        vm.getNewStatuses = getNewStatuses;
        vm.getEmpty = getEmpty;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshFavorites();
        }

        getEmpty.$inject = ['finalStatus'];
        function getEmpty(finalStatus) {
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        }
    }
})();
