(function() {
    'use strict';

    angular.module('tatami')
        .controller('FavoritesCtrl', favoritesCtrl);

    favoritesCtrl.$inject = ['favorites'];
    function favoritesCtrl(favorites) {
        var vm = this;
        vm.favorites = favorites;
        vm.remove = remove;

        remove.$inject = ['favorite'];
        function remove(favorite) {
            vm.favorites.splice(vm.favorites.indexOf(favorite), 1);
        }
    }
})();
