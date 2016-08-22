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
                        controller: 'HomeController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timeline/content.html',
                        controller: 'TimelineController'
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
