angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tab.favorites', {
                url: '/favorites',
                views: {
                    'tab-favorites': {
                        templateUrl: 'app/components/favorites/tab-favorites.html',
                        controller: 'FavoritesCtrl'
                    }
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
    }
);
