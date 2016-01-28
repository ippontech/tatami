(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('tab.favorites', {
                url: '/favorites',
                views: {
                    'tab-favorites': {
                        templateUrl: 'app/components/favorites/tab-favorites.html',
                        controller: 'FavoritesCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    favorites: favorites
                }
            })
            .state('tab.favorites-detail', {
                url: '/favorites/:favoriteId',
                views: {
                    'tab-favorites': {
                        templateUrl: 'app/components/favorites/favorites-detail.html',
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
