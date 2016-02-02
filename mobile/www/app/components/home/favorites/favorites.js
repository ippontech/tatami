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
                        templateUrl: 'app/components/home/favorites/favorites.html',
                        controller: 'FavoritesCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    favorites: favorites
                }
            })
            .state('favorites.detail', {
                url: '/detail/:statusId',
                views: {
                    'favorites@home': {
                        templateUrl: 'app/components/home/detail/detail.html',
                        controller: 'DetailCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    status: getStatus
                }
            });

        favorites.$inject = ['HomeService'];
        function favorites(HomeService) {
            return HomeService.getFavorites().$promise;
        }

        getStatus.$inject = ['StatusService', '$stateParams'];
        function getStatus(StatusService, $stateParams) {
            return StatusService.get({ statusId : $stateParams.statusId }).$promise;
        }
    }
})();
