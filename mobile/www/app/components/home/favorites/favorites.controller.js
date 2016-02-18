(function() {
    'use strict';

    angular.module('tatami')
        .controller('FavoritesCtrl', favoritesCtrl);

    favoritesCtrl.$inject = ['favorites', 'currentUser', 'TatamiStatusRefresherService'];
    function favoritesCtrl(favorites, currentUser, TatamiStatusRefresherService) {
        var vm = this;
        vm.favorites = favorites;
        vm.currentUser = currentUser;
        vm.getNewStatuses = getNewStatuses;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshFavorites();
        }
    }
})();
