(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(favoritesConfig);

    favoritesConfig.$inject = ['$stateProvider'];
    function favoritesConfig($stateProvider) {
        $stateProvider
            .state('favorites', {
                parent: 'sidebarHome',
                url: '/favorites',
                views: {
                    'homeSide@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/sidebar/homeSidebar.html',
                        controller: 'HomeSidebarController'
                    },
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timeline/timelineHeader.html',
                        controller: 'HomeController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/statuslist/statusList.html',
                        controller: 'StatusListController'
                    }
                },
                resolve: {
                    statuses: ['HomeService', function (HomeService) {
                        return HomeService.getFavorites().$promise;
                    }]
                }
            })
        }
})();
