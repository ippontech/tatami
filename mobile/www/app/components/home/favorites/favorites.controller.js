(function() {
    'use strict';

    angular.module('tatami')
        .controller('FavoritesCtrl', favoritesCtrl);

    favoritesCtrl.$inject = ['favorites', 'TatamiStatusRefresherService'];
    function favoritesCtrl(favorites, TatamiStatusRefresherService) {
        var vm = this;
        vm.favorites = favorites;
        vm.getNewStatuses = getNewStatuses;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshFavorites();
        }
    }
})();
