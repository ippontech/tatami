(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('favorites', {
                url: '/favorites',
                parent: 'home',
                views: {
                    'favorites': {
                        templateUrl: 'app/components/home/favorites/tab-favorites.html',
                        controller: 'FavoritesCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    favorites: favorites
                }
            })
            .state('favorites-detail', {
                url: '/favorites/:favoriteId',
                parent: 'home',
                views: {
                    'favorites': {
                        templateUrl: 'app/components/home/favorites/favorites-detail.html',
                        controller: 'FavoritesDetailCtrl'
                    }
                }
            });

        favorites.$inject = ['HomeService'];
        function favorites(HomeService) {
            return HomeService.getFavorites().$promise;
        }
    }
})();
