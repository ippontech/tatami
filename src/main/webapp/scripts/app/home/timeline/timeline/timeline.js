'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('timeline', {
                parent: 'sidebarHome',
                url: '/timeline',
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
                    statuses: ['StatusService', function (StatusService) {
                        return StatusService.getHomeTimeline().$promise;
                    }],
                    showModal: ['statuses', function (statuses) {
                        return statuses.length === 0;
                    }]
                }
            })
    });
