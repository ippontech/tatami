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
            });
    });