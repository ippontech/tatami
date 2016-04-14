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
            });

        favorites.$inject = ['HomeService'];
        function favorites(HomeService) {
            return HomeService.getFavorites().$promise;
        }
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('favorites', 'home');
        TatamiState.addConversationState('favorites', 'home');
        TatamiState.addTagState('favorites', 'home');
    }
})();
