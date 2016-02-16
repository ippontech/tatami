(function() {
    'use strict';

    angular.module('tatami')
        .controller('FavoritesCtrl', favoritesCtrl);

    favoritesCtrl.$inject = ['favorites', 'TatamiStatusRefresherService'];
    function favoritesCtrl(favorites, TatamiStatusRefresherService) {
        var vm = this;
        vm.favorites = favorites;
        vm.remove = remove;
        vm.getNewStatuses = getNewStatuses;

        remove.$inject = ['favorite'];
        function remove(favorite) {
            vm.favorites.splice(vm.favorites.indexOf(favorite), 1);
        }

        function getNewStatuses() {
            TatamiStatusRefresherService.refreshFavorites().then(setStatuses);
        }

        setStatuses.$inject = ['favorites'];
        function setStatuses(favorites) {
            vm.favorites = favorites;
        }
    }
})();
