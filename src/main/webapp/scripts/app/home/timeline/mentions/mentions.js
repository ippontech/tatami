(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(mentionsConfig);

    mentionsConfig.$inject = ['$stateProvider'];
    function mentionsConfig($stateProvider) {
        $stateProvider
            .state('mentions', {
                parent: 'sidebarHome',
                url: '/mentions',
                views: {
                    'homeSide@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/sidebar/homeSidebar.html',
                        controller: 'HomeSidebarController'
                    },
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timeline/timelineHeader.html',
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/statuslist/statusList.html',
                        controller: 'StatusListController'
                    }
                },
                resolve: {
                    statuses: ['HomeService', function (HomeService) {
                        return HomeService.getMentions().$promise;
                    }]

                }
            })
        }
})();

